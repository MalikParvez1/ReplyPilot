import { prisma } from '@/lib/prisma';

// 1. Wir definieren die Limits hardcodiert
export const PLAN_LIMITS = {
  free:     { reviews: 50,  templates: 1, autoReply: false, analytics: false },
  starter:  { reviews: 50,  templates: 1, autoReply: false, analytics: false },
  pro:      { reviews: 200, templates: 5, autoReply: 'positive', analytics: true },
  business: { reviews: 999999, templates: 999, autoReply: 'all', analytics: true },
};

export class PlanService {
  // 2. Hilfsfunktion: Prüft, ob der Nutzer noch Antworten generieren darf
  static async checkReviewLimit(userId: string, userPlan: string) {
    const plan = userPlan.toLowerCase() as keyof typeof PLAN_LIMITS;
    const limit = PLAN_LIMITS[plan]?.reviews || 50;

    // Finde den ersten Tag des aktuellen Monats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Zähle, wie viele Reviews dieser User diesen Monat schon GESTARTET/BEANTWORTET hat
    const usageCount = await prisma.review.count({
      where: {
        userId: userId,
        updatedAt: { gte: startOfMonth },
        aiResponse: { not: null } // Zählt nur die, wo KI genutzt wurde
      }
    });

    return {
      usageCount,
      limit,
      hasReachedLimit: usageCount >= limit
    };
  }

  // 3. Hilfsfunktion: Hat der User Zugriff auf Analytics?
  static hasAnalyticsAccess(userPlan: string) {
    const plan = userPlan.toLowerCase() as keyof typeof PLAN_LIMITS;
    return PLAN_LIMITS[plan]?.analytics || false;
  }
}
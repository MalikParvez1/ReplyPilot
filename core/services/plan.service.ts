import { prisma } from '@/lib/prisma';

export const PLAN_LIMITS = {
  free:     { reviews: 50,  locations: 1, templates: 1, autoReply: false, analytics: false },
  starter:  { reviews: 50,  locations: 1, templates: 1, autoReply: false, analytics: false },
  pro:      { reviews: 200, locations: 3, templates: 5, autoReply: 'positive', analytics: true },
  business: { reviews: 999999, locations: 10, templates: 999, autoReply: 'all', analytics: true },
};

export class PlanService {
  
  // 1. Check für die KI-Antworten (Credits)
  static async checkReviewLimit(userId: string, userPlan: string) {
    const plan = userPlan.toLowerCase() as keyof typeof PLAN_LIMITS;
    const limit = PLAN_LIMITS[plan]?.reviews || 50;

    // Finde den ersten Tag des aktuellen Monats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Zähle, wie viele Reviews dieser User diesen Monat schon beantwortet hat
    // Wichtig: Da Reviews jetzt an Location hängen, müssen wir über den User zur Location gehen
    const usageCount = await prisma.review.count({
      where: {
        location: { userId: userId },
        updatedAt: { gte: startOfMonth },
        replyText: { not: null } 
      }
    });

    return {
      usageCount,
      limit,
      hasReachedLimit: usageCount >= limit
    };
  }

  // 2. NEU: Check für die Standorte
  static async checkLocationLimit(userId: string, userPlan: string) {
    const plan = userPlan.toLowerCase() as keyof typeof PLAN_LIMITS;
    const limit = PLAN_LIMITS[plan]?.locations || 1;

    const locationCount = await prisma.location.count({
      where: { userId: userId }
    });

    return {
      locationCount,
      limit,
      canAddMore: locationCount < limit
    };
  }

  // 3. Check für Analytics (Boolean)
  static hasAnalyticsAccess(userPlan: string) {
    const plan = userPlan.toLowerCase() as keyof typeof PLAN_LIMITS;
    return PLAN_LIMITS[plan]?.analytics || false;
  }
}
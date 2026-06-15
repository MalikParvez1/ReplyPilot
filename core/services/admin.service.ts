// src/core/services/admin.service.ts
import { prisma } from '@/lib/prisma';

export class AdminService {
  // Holt alle Betriebe und deren verknüpfte Nutzer sowie die Anzahl der Reviews
  async getAllBusinesses() {
    return prisma.business.findMany({
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true }
        },
        _count: {
          select: { reviews: true } // Zählt, wie viele Rezensionen der Betrieb importiert hat
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Beispiel: Einen Betrieb (und damit alle seine Nutzer und Reviews) löschen
  async deleteBusiness(businessId: string) {
    return prisma.business.delete({
      where: { id: businessId }
    });
  }
}
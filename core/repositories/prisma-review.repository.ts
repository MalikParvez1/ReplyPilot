// src/core/repositories/prisma-review.repository.ts
import { prisma } from '@/lib/prisma';
import { IReviewRepository, Review } from '../interfaces/review.interface';

export class PrismaReviewRepository implements IReviewRepository {
  
  // 1. Parameter annehmen
  async findUnanswered(businessId: string): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      where: { 
        status: { in: ['UNANSWERED', 'GENERATED'] },
        businessId: businessId // 2. Nur Rezensionen dieses Betriebs laden!
      },
      orderBy: { createdAt: 'desc' }
    });
    return reviews as Review[];
  }

  async findById(id: string): Promise<Review | null> {
    const review = await prisma.review.findUnique({ where: { id } });
    return review as Review | null;
  }

  async updateStatus(id: string, status: Review['status'], replyText?: string | null): Promise<Review> {
    const review = await prisma.review.update({
      where: { id },
      data: { status, replyText }
    });
    return review as Review;
  }
}
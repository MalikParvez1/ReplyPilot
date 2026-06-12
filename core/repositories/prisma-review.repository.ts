import { prisma } from '@/lib/prisma';
import { IReviewRepository, Review } from '../interfaces/review.interface';

export class PrismaReviewRepository implements IReviewRepository {
  async findUnanswered(): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      where: { status: { in: ['UNANSWERED', 'GENERATED'] } },
      orderBy: { createdAt: 'desc' }
    });
    
    // Wir casten das Array, da Prisma 'status' nur als 'string' sieht, 
    // wir aber wissen, dass es unsere spezifischen Status-Strings sind.
    return reviews as Review[];
  }

  async findById(id: string): Promise<Review | null> {
    const review = await prisma.review.findUnique({ where: { id } });
    
    return review ? (review as Review) : null;
  }

  async updateStatus(id: string, status: Review['status'], replyText?: string | null): Promise<Review> {
    const review = await prisma.review.update({
      where: { id },
      data: { status, replyText }
    });
    
    return review as Review;
  }

  async saveReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const newReview = await prisma.review.create({ 
      data: review 
    });
    
    return newReview as Review;
  }
}
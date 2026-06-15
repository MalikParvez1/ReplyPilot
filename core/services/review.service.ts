// src/core/services/review.service.ts
import { IReviewRepository } from '../interfaces/review.interface';
import { IAIService, AISettings } from '../interfaces/ai.interface';

export class ReviewService {
  constructor(
    private reviewRepo: IReviewRepository,
    private aiService: IAIService
  ) {}

  // HIER FEHLTE DER PARAMETER! 
  async getPendingReviews(businessId: string) {
    // Wir reichen die ID an das Repository weiter
    return this.reviewRepo.findUnanswered(businessId);
  }

  async generateAiReply(reviewId: string, settings: AISettings) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new Error('Review nicht gefunden');

    const aiReply = await this.aiService.generateResponse(review.comment, review.rating, settings);
    
    return this.reviewRepo.updateStatus(reviewId, 'GENERATED', aiReply);
  }

  async publishReply(reviewId: string, finalReplyText: string) {
    // (Später: API Aufruf an Google)
    return this.reviewRepo.updateStatus(reviewId, 'ANSWERED', finalReplyText);
  }
}
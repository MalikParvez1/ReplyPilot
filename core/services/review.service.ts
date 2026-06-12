import { IReviewRepository } from '../interfaces/review.interface';
import { IAIService, AISettings } from '../interfaces/ai.interface';

export class ReviewService {
  constructor(
    private reviewRepo: IReviewRepository,
    private aiService: IAIService
  ) {}

  async getPendingReviews() {
    return this.reviewRepo.findUnanswered();
  }

  async generateAiReply(reviewId: string, settings: AISettings) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new Error('Review nicht gefunden');

    const aiReply = await this.aiService.generateResponse(review.comment, review.rating, settings);
    
    // Status updaten, dass ein Entwurf existiert
    return this.reviewRepo.updateStatus(reviewId, 'GENERATED', aiReply);
  }

  async publishReply(reviewId: string, finalReplyText: string) {
    // 1. Hier würde der API-Aufruf an das Google Business Profile erfolgen:
    // await googleBusinessApi.postReply(reviewId, finalReplyText);
    
    // 2. Datenbank-Status auf beantwortet setzen
    return this.reviewRepo.updateStatus(reviewId, 'ANSWERED', finalReplyText);
  }
}
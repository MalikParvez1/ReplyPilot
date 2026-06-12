export interface Review {
  id: string;
  googleReviewId: string;
  authorName: string;
  avatarUrl: string | null; // Geändert von ?: string
  rating: number;
  comment: string;
  replyText: string | null; // Geändert von ?: string
  status: 'UNANSWERED' | 'GENERATED' | 'ANSWERED';
  createdAt: Date;
  updatedAt: Date;          // Hinzugefügt
}

export interface IReviewRepository {
  findUnanswered(): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  updateStatus(id: string, status: Review['status'], replyText?: string | null): Promise<Review>;
  saveReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review>;
}
// src/core/interfaces/review.interface.ts

export interface Review {
  id: string;
  googleReviewId: string;
  authorName: string;
  avatarUrl?: string | null;
  rating: number;
  comment: string;
  replyText?: string | null;
  status: 'UNANSWERED' | 'GENERATED' | 'ANSWERED';
  businessId: string; // <-- Wichtig für die SaaS-Logik
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewRepository {
  // Hier fügen wir den Parameter hinzu:
  findUnanswered(businessId: string): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  updateStatus(id: string, status: Review['status'], replyText?: string | null): Promise<Review>;
}
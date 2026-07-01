// core/interfaces/review.interface.ts

export interface Review {
  id: string;
  googleReviewId: string | null; // Nullable gemacht, da Prisma es auch so definiert
  authorName: string;
  avatarUrl?: string | null;
  rating: number;
  comment: string;
  replyText?: string | null;
  status: string; // Am besten als string, oder 'UNANSWERED' | 'ANSWERED'
  locationId: string; // <-- HIER IST DIE WICHTIGE ÄNDERUNG (statt businessId)
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewRepository {
  // Auch hier direkt konsistent auf locationId anpassen:
  findUnanswered(locationId: string): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  updateStatus(id: string, status: string, replyText?: string | null): Promise<Review>;
}
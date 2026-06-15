import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { PrismaReviewRepository } from '@/core/repositories/prisma-review.repository';
import { OpenAIService } from '@/core/services/openai.service';
import { ReviewService } from '@/core/services/review.service';

export async function GET() {
  try {
    // 1. Clerk Authentifizierung
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Datenbank-Check: Zu welchem Betrieb gehört dieser User?
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!dbUser || !dbUser.businessId) {
      return NextResponse.json({ error: "Kein Betrieb zugeordnet" }, { status: 403 });
    }

    // 3. Business Logik aufrufen (SOLID)
    const reviewRepository = new PrismaReviewRepository();
    const aiService = new OpenAIService();
    const reviewService = new ReviewService(reviewRepository, aiService);

    // 4. Nur Reviews dieses Betriebs laden
    const reviews = await reviewService.getPendingReviews(dbUser.businessId);
    
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
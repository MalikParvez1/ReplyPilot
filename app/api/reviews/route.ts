import { NextResponse } from 'next/server';
import { PrismaReviewRepository } from '@/core/repositories/prisma-review.repository';
import { OpenAIService } from '@/core/services/openai.service';
import { ReviewService } from '@/core/services/review.service';

const reviewRepository = new PrismaReviewRepository();
const aiService = new OpenAIService();
const reviewService = new ReviewService(reviewRepository, aiService);

export async function GET() {
  try {
    const reviews = await reviewService.getPendingReviews();
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaReviewRepository } from '@/core/repositories/prisma-review.repository';
import { OpenAIService } from '@/core/services/openai.service';
import { ReviewService } from '@/core/services/review.service';

const reviewRepository = new PrismaReviewRepository();
const aiService = new OpenAIService();
const reviewService = new ReviewService(reviewRepository, aiService);

export async function POST(request: Request) {
  try {
    const { reviewId, settings } = await request.json();
    if (!reviewId || !settings) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const updatedReview = await reviewService.generateAiReply(reviewId, settings);
    return NextResponse.json(updatedReview);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
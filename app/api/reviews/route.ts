import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ 
      where: { clerkId: clerkId } 
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: "Benutzer nicht in Datenbank gefunden" }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' }
    });

    // HIER WURDE ANGEPASST: Wir nutzen jetzt die exakten Namen aus dem Review-Interface
    const mappedReviews = reviews.map(review => ({
      id: review.id,
      googleReviewId: review.googleReviewId || "",
      authorName: review.authorName,     // UI: authorName
      rating: review.rating,             // UI: rating
      comment: review.text || "",        // UI: comment
      replyText: review.aiResponse,      // UI: replyText
      status: review.aiResponse ? 'ANSWERED' : 'UNANSWERED',
      businessId: review.userId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));
    
    return NextResponse.json(mappedReviews);
  } catch (error) {
    console.error("API Reviews GET Error:", error);
    return NextResponse.json({ error: "Interner Server Fehler" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId, replyText } = await request.json();

    if (!reviewId || !replyText) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Speichere die Antwort in der PostgreSQL-Datenbank mit den KORREKTEN Spaltennamen
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        replyText: replyText,     // <-- HIER KORRIGIERT (statt aiResponse)
        status: "ANSWERED"        // <-- HIER KORRIGIERT (statt isPublished)
      }
    });

    return NextResponse.json(updatedReview);

  } catch (error) {
    console.error("Publish Error:", error);
    return NextResponse.json({ error: "Interner Server Fehler" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId, replyText } = await req.json();

    if (!reviewId || !replyText) {
      return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 });
    }

    // Speichere die Antwort in der PostgreSQL-Datenbank
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        aiResponse: replyText, // Das ist das Feld aus deinem schema.prisma
        isPublished: true      // Status auf veröffentlicht setzen
      }
    });

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    console.error("Publish Error:", error);
    return NextResponse.json({ error: "Fehler beim Veröffentlichen" }, { status: 500 });
  }
}
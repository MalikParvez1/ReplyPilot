import { NextResponse } from 'next/server';
import { OpenAIService } from '@/core/services/openai.service';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const aiService = new OpenAIService();

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewText, rating } = await request.json();

    if (!reviewText || rating === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Hole den Nutzer und seine individuellen Einstellungen aus PostgreSQL
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      include: { settings: true }
    });

    // 2. HIER WAR DER FEHLER: Wir übergeben jetzt die echten DB-Werte an die KI!
    const userSettings = {
      businessName: dbUser?.settings?.businessName || "Unser Unternehmen",
      businessType: dbUser?.settings?.businessType || "Lokales Geschäft",
      toneOfVoice: dbUser?.settings?.toneOfVoice || "professionell und freundlich",
      additionalContext: dbUser?.settings?.additionalContext || "",
      closingWord: dbUser?.settings?.closingWord || "",       // Jetzt wird dein Schlusswort geladen!
      forbiddenWords: dbUser?.settings?.forbiddenWords || ""  // Jetzt werden verbotene Wörter geladen!
    };

    // 3. KI-Antworten über dein lokales Qwen-Modell generieren
    const result = await aiService.generateReviewReplies(reviewText, rating, userSettings);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: "Interner Server Fehler" }, { status: 500 });
  }
}
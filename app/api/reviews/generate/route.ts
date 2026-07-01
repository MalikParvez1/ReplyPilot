import { NextResponse } from 'next/server';
import { OpenAIService } from '@/core/services/openai.service';
import { PlanService } from '@/core/services/plan.service'; // WICHTIG: PlanService importieren
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const aiService = new OpenAIService();

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Hole den Nutzer und seine individuellen Einstellungen EINMAL aus PostgreSQL
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      include: { settings: true }
    });

    if (!dbUser) return NextResponse.json({ error: 'User nicht gefunden' }, { status: 404 });

    // --- NEU: TARIF-CHECK VOR DER KI-GENERIERUNG ---
    // HIER KORRIGIERT: PlanService statt aiService
    const { hasReachedLimit, limit } = await PlanService.checkReviewLimit(dbUser.id, dbUser.plan);
    
    if (hasReachedLimit) {
      return NextResponse.json({ 
        error: 'LIMIT_REACHED', 
        message: `Du hast dein monatliches Limit von ${limit} Antworten erreicht. Bitte wechsle in den Pro-Tarif.`
      }, { status: 403 });
    }
    // ------------------------------------------------

    const { reviewText, rating } = await request.json();

    if (!reviewText || rating === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 2. Wir übergeben die echten DB-Werte (aus dem bereits geladenen dbUser) an die KI!
    const userSettings = {
      businessName: dbUser?.settings?.businessName || "Unser Unternehmen",
      businessType: dbUser?.settings?.businessType || "Lokales Geschäft",
      toneOfVoice: dbUser?.settings?.toneOfVoice || "professionell und freundlich",
      additionalContext: dbUser?.settings?.additionalContext || "",
      closingWord: dbUser?.settings?.closingWord || "",       
      forbiddenWords: dbUser?.settings?.forbiddenWords || ""  
    };

    // 3. KI-Antworten generieren
    const result = await aiService.generateReviewReplies(reviewText, rating, userSettings);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: "Interner Server Fehler" }, { status: 500 });
  }
}
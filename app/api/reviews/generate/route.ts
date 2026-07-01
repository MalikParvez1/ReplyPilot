import { NextResponse } from 'next/server';
import { OpenAIService } from '@/core/services/openai.service';
import { PlanService } from '@/core/services/plan.service';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const aiService = new OpenAIService();

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!dbUser) return NextResponse.json({ error: 'User nicht gefunden' }, { status: 404 });

    // 1. Hole den Body der Anfrage
    const { reviewText, rating, locationId } = await request.json();

    if (!reviewText || rating === undefined || !locationId) {
      return NextResponse.json({ error: 'Missing parameters (reviewText, rating, locationId required)' }, { status: 400 });
    }

    // 2. TARIF-CHECK
    const { hasReachedLimit, limit } = await PlanService.checkReviewLimit(dbUser.id, dbUser.plan);
    
    if (hasReachedLimit) {
      return NextResponse.json({ 
        error: 'LIMIT_REACHED', 
        message: `Du hast dein monatliches Limit von ${limit} Antworten erreicht. Bitte wechsle in den Pro-Tarif.`
      }, { status: 403 });
    }

    // 3. Hole die Settings SPEZIFISCH FÜR DIESEN STANDORT
    const locationSettings = await prisma.settings.findUnique({
      where: { locationId: locationId }
    });

    // 4. Wir übergeben die echten DB-Werte an die KI!
    const userSettings = {
      businessName: locationSettings?.businessName || "Unser Unternehmen",
      businessType: locationSettings?.businessType || "Lokales Geschäft",
      toneOfVoice: locationSettings?.toneOfVoice || "professionell und freundlich",
      additionalContext: locationSettings?.additionalContext || "",
      closingWord: locationSettings?.closingWord || "",       
      forbiddenWords: locationSettings?.forbiddenWords || ""  
    };

    // 5. KI-Antworten generieren
    const result = await aiService.generateReviewReplies(reviewText, rating, userSettings);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: "Interner Server Fehler" }, { status: 500 });
  }
}
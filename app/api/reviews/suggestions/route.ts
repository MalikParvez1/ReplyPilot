import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { OpenAIService } from '@/core/services/openai.service';
import { AISettings } from '@/core/interfaces/ai.interface';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId } = await req.json();

    // Benutzer und Business prüfen
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || !dbUser.businessId) {
      return NextResponse.json({ error: 'Kein Betrieb zugeordnet' }, { status: 403 });
    }

    // Review laden
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.businessId !== dbUser.businessId) {
      return NextResponse.json({ error: 'Review nicht gefunden' }, { status: 404 });
    }

    // AI Settings laden
    const settings = await prisma.aISettings.findUnique({
      where: { businessId: dbUser.businessId },
    });

    const aiSettings: AISettings = {
      tone: (settings?.tone as 'professional' | 'friendly' | 'casual' | 'empathetic') || 'friendly',
      length: (settings?.length as 'short' | 'medium' | 'long') || 'medium',
      includeBusinessName: settings?.includeBusinessName ?? true,
      customContext: settings?.customContext || undefined,
      language: settings?.language || 'de',
      standardReplyText: settings?.standardReplyText || undefined,
    };

    // 3 Vorschläge generieren
    const aiService = new OpenAIService();
    const suggestions = await aiService.generateMultipleResponses(
      review.comment,
      review.rating,
      review.authorName,
      aiSettings
    );

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

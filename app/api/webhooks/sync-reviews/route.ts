import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Webhook für Google Review-Synchronisation
 * 
 * Dieser Endpoint kann:
 * 1. Von externen Services (Google API, Zapier, Make) aufgerufen werden
 * 2. Als Cronjob mit einer Third-Party wie EasyCron konfiguriert werden
 * 
 * Beispiel-Cron-URL:
 * https://yourapp.com/api/webhooks/sync-reviews?businessId=abc123&apiKey=your_secret_key
 * 
 * Konfigurieren Sie einen Cronjob (z.B. alle 6 Stunden):
 * - EasyCron, Cron-job.org, oder AWS EventBridge
 */

export async function POST(req: Request) {
  try {
    // Validierung: API Key aus Header
    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { businessId, reviews } = await req.json();

    if (!businessId || !Array.isArray(reviews)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Überprüfen, dass businessId existiert
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Reviews synchronisieren (nur neue hinzufügen, existierende nicht überschreiben)
    let createdCount = 0;
    let skippedCount = 0;

    for (const review of reviews) {
      const existing = await prisma.review.findUnique({
        where: { googleReviewId: review.googleReviewId },
      });

      if (!existing) {
        await prisma.review.create({
          data: {
            googleReviewId: review.googleReviewId,
            authorName: review.authorName,
            avatarUrl: review.avatarUrl,
            rating: review.rating,
            comment: review.comment,
            businessId,
            status: 'UNANSWERED',
          },
        });
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync completed: ${createdCount} new reviews, ${skippedCount} skipped`,
      createdCount,
      skippedCount,
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET Endpoint für Cronjob-Auslösung
 * Ruft die Google API auf und synchronisiert Reviews
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get('apiKey');
    const businessId = searchParams.get('businessId');

    if (apiKey !== process.env.WEBHOOK_API_KEY || !businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Hier würde die Google My Business API aufgerufen werden
    // Für jetzt: Dummy-Implementierung
    
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, googlePlaceId: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Review sync triggered (implementation pending)',
      businessId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

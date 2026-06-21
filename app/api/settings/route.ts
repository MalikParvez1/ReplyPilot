import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || !dbUser.businessId) {
      return NextResponse.json({ error: 'Kein Betrieb zugeordnet' }, { status: 403 });
    }

    const settings = await prisma.aISettings.findUnique({
      where: { businessId: dbUser.businessId },
    });

    if (!settings) {
      return NextResponse.json({ error: 'Einstellungen nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || !dbUser.businessId) {
      return NextResponse.json({ error: 'Kein Betrieb zugeordnet' }, { status: 403 });
    }

    const body = await req.json();
    const { tone, length, includeBusinessName, customContext, language, standardReplyText } = body;

    const settings = await prisma.aISettings.upsert({
      where: { businessId: dbUser.businessId },
      update: {
        tone,
        length,
        includeBusinessName,
        customContext,
        language,
        standardReplyText,
      },
      create: {
        businessId: dbUser.businessId,
        tone,
        length,
        includeBusinessName,
        customContext,
        language,
        standardReplyText,
      },
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ 
      where: { clerkId }, include: { settings: true } 
    });
    
    return NextResponse.json(dbUser?.settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId } });
    if (!dbUser) return NextResponse.json({ error: "User nicht gefunden" }, { status: 404 });

    const data = await req.json();

    // HIER IST DIE KORREKTUR: prisma.settings (mit "s")
    const settings = await prisma.settings.upsert({ 
      where: { userId: dbUser.id },
      update: {
        businessName: data.businessName,
        businessType: data.businessType,
        toneOfVoice: data.toneOfVoice,
        additionalContext: data.additionalContext,
        closingWord: data.closingWord,
        forbiddenWords: data.forbiddenWords,
      },
      create: {
        userId: dbUser.id,
        businessName: data.businessName,
        businessType: data.businessType,
        toneOfVoice: data.toneOfVoice,
        additionalContext: data.additionalContext,
        closingWord: data.closingWord,
        forbiddenWords: data.forbiddenWords,
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen" }, { status: 500 });
  }
}
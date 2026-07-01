import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // --- HIER IST DIE WICHTIGE ÄNDERUNG ---
    // Wir fragen die Reviews jetzt über die Beziehung zum Standort ab
    const reviews = await prisma.review.findMany({
      where: { 
        location: {
          userId: dbUser.id
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);

  } catch (error) {
    console.error('API Reviews GET Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
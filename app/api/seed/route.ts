import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const myUserId = "cmqy07y4s0000i01y582xtdji"; // Deine echte User-ID[cite: 5]

  try {
    // Erstellt 4 Beispieldaten auf einmal
    await prisma.review.createMany({
      data: [
        {
          userId: myUserId,
          authorName: "Max Mustermann",
          rating: 5,
          text: "Absolut fantastisch! Die Beratung war top und das Ergebnis spricht für sich.",
          isPublished: false,
        },
        {
          userId: myUserId,
          authorName: "Sabine Schmidt",
          rating: 4,
          text: "Sehr gut, aber die Wartezeit war mit 15 Minuten etwas zu lang.",
          isPublished: false,
        },
        {
          userId: myUserId,
          authorName: "Kritischer Kunde",
          rating: 2,
          text: "Leider nicht wie erwartet. Das Produkt war fehlerhaft.",
          aiResponse: "Lieber Kunde, es tut uns leid, dass Sie unzufrieden sind. Bitte kontaktieren Sie unseren Support.",
          isPublished: true, // Das wird im Tab "Beantwortet" landen!
        },
        {
          userId: myUserId,
          authorName: "Julia W.",
          rating: 5,
          text: "Immer wieder gerne, mein absoluter Lieblingsladen!",
          isPublished: false,
        }
      ]
    });

    return NextResponse.json({ message: "Erfolgreich 4 Test-Rezensionen angelegt!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fehler beim Anlegen" }, { status: 500 });
  }
}
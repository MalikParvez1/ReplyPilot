import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Nicht eingeloggt", { status: 401 });

    // 1. Hole den User und seinen Hauptstandort
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { locations: true }
    });

    if (!user || user.locations.length === 0) {
      return new NextResponse("Nutzer oder Standort nicht gefunden. Bitte besuche zuerst das Dashboard.", { status: 404 });
    }

    const locationId = user.locations[0].id; // Wir nehmen den ersten Standort

    // 2. Räume alte Testdaten für diesen Standort auf (falls vorhanden)
    await prisma.review.deleteMany({ where: { locationId } });
    await prisma.settings.deleteMany({ where: { locationId } });

    // 3. Lege die Markenstimme (Settings) für diesen Standort an
    await prisma.settings.create({
      data: {
        locationId: locationId,
        businessName: "Café Mustermann",
        businessType: "Café & Bäckerei",
        toneOfVoice: "Herzlich, fröhlich und per Du",
        additionalContext: "Wir sind berühmt für unseren Zimtkuchen.",
        closingWord: "Liebe Grüße vom Café Mustermann Team",
      }
    });

    // 4. Lege 4 brandneue Test-Bewertungen an
    await prisma.review.createMany({
      data: [
        { 
          locationId: locationId, 
          authorName: "Anna M.", 
          rating: 5, 
          comment: "Bester Kaffee der Stadt! Komme jeden Morgen hierher.", 
          status: "UNANSWERED" 
        },
        { 
          locationId: locationId, 
          authorName: "Peter S.", 
          rating: 4, 
          comment: "Sehr gemütlich, Kuchen war lecker. Ein Stern Abzug weil es etwas laut war.", 
          status: "UNANSWERED" 
        },
        { 
          locationId: locationId, 
          authorName: "Lisa K.", 
          rating: 1, 
          comment: "Bedienung hat mich 15 Minuten ignoriert. Gehe ich nie wieder hin!", 
          status: "UNANSWERED" 
        },
        { 
          locationId: locationId, 
          authorName: "Tom H.", 
          rating: 5, 
          comment: "Einfach top. Der Zimtkuchen ist ein Traum.", 
          status: "UNANSWERED" 
        }
      ]
    });

    return NextResponse.json({ 
      message: "Erfolg! Testdaten (Markenstimme + 4 Bewertungen) wurden für deinen Standort angelegt." 
    });

  } catch (error) {
    console.error("Seed Error:", error);
    return new NextResponse("Interner Fehler beim Seeden", { status: 500 });
  }
}
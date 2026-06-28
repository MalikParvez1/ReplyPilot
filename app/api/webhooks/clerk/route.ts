import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Hole das Secret aus deiner .env Datei
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Das WEBHOOK_SECRET fehlt in der .env Datei!');
  }

  // 2. Lese die Svix-Header aus dem Request aus (Sicherheitsprüfung)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Fehler: Svix-Header fehlen', { status: 400 });
  }

  // 3. Lese den Body der Anfrage aus
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 4. Verifiziere die Signatur mit Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Fehler bei der Webhook-Verifizierung:', err);
    return new NextResponse('Fehler bei der Verifizierung', { status: 400 });
  }

  // 5. Verarbeite das Event und schreibe es in PostgreSQL
  const eventType = evt.type;

  // NEUER ODER AKTUALISIERTER NUTZER
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (!primaryEmail) {
      return new NextResponse('Keine E-Mail gefunden', { status: 400 });
    }

    try {
      // upsert: Erstellt den Nutzer, oder aktualisiert ihn, falls er schon existiert
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
        },
        create: {
          clerkId: id,
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
        }
      });
      console.log(`✅ Nutzer ${id} in PostgreSQL synchronisiert.`);
    } catch (error) {
      console.error('Datenbank-Fehler beim Speichern des Nutzers:', error);
      return new NextResponse('Interner Datenbankfehler', { status: 500 });
    }
  }

  // GELÖSCHTER NUTZER
  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (!id) return new NextResponse('Keine ID gefunden', { status: 400 });

    try {
      await prisma.user.delete({
        where: { clerkId: id }
      });
      console.log(`🗑️ Nutzer ${id} aus PostgreSQL gelöscht.`);
    } catch (error) {
      console.error('Datenbank-Fehler beim Löschen des Nutzers:', error);
    }
  }

  // 6. Melde Clerk zurück, dass alles geklappt hat
  return new NextResponse('Webhook empfangen und verarbeitet', { status: 200 });
}
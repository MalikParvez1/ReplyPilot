import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

// Initialisiere Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia", // Nutze die aktuelle API-Version
});

export async function POST(req: Request) {
  try {
    // 1. Prüfe, ob der Nutzer eingeloggt ist
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Nicht autorisiert", { status: 401 });
    }

    // 2. Hole die Stripe-Preis-ID aus dem Request des Frontends
    const { priceId } = await req.json();
    if (!priceId) {
      return new NextResponse("Preis-ID fehlt", { status: 400 });
    }

    // 3. Erstelle eine Checkout-Session bei Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"], // Paypal ist in DE sehr beliebt
      mode: "subscription", // Wichtig für wiederkehrende Zahlungen (Abos)
      billing_address_collection: "auto",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Rückleitungen nach Erfolg oder Abbruch
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tarife?canceled=true`,
      // WICHTIG: Gib die Clerk-UserId an Stripe weiter, damit du später über 
      // Webhooks weißt, welcher Nutzer bezahlt hat!
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    // 4. Sende die Checkout-URL zurück ans Frontend
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return new NextResponse("Interner Serverfehler", { status: 500 });
  }
}
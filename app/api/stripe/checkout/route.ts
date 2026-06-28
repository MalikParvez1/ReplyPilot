import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Nicht autorisiert", { status: 401 });
    }

    const { priceId, trialPeriodDays } = await req.json();
    if (!priceId) {
      return new NextResponse("Preis-ID fehlt", { status: 400 });
    }

    const normalizedTrialPeriodDays = Number(trialPeriodDays);
    const subscriptionData = Number.isInteger(normalizedTrialPeriodDays) && normalizedTrialPeriodDays > 0
      ? { trial_period_days: normalizedTrialPeriodDays }
      : undefined;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: subscriptionData,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tarife?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return new NextResponse("Interner Serverfehler", { status: 500 });
  }
}
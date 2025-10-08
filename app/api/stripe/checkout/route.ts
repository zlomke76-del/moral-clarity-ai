// app/api/stripe/checkout/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Extract payload from front-end request
    const { userId = null, seats = 1, orgName = null } = await req.json();

    // Get the price ID from environment variables
    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID_PRO environment variable" },
        { status: 500 }
      );
    }

    // Determine the correct site origin
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      process.env.VERCEL_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: seats,
        },
      ],
      metadata: {
        userId,
        orgName,
      },
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`,
      subscription_data: {
        trial_period_days: 0,
      },
    });

    // Return the Stripe Checkout URL to the client
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error during checkout" },
      { status: 500 }
    );
  }
}

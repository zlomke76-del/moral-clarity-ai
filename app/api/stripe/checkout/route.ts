// app/api/stripe/checkout/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

/** Keep your existing origin helper */
function getOrigin(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;

  const vercelHost = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercelHost) return `https://${vercelHost}`;

  const h = req.headers;
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

/** Map the 3 plans to their recurring price IDs (set these in your env) */
const PRICE_BY_PLAN = {
  standard: process.env.STRIPE_PRICE_STANDARD, // 1 seat
  family: process.env.STRIPE_PRICE_FAMILY,     // up to 4 seats, fixed price
  ministry: process.env.STRIPE_PRICE_MINISTRY, // up to 10 seats, fixed price
} as const;

/** Hard caps per plan so we can store in subscription metadata */
const SEATS_MAX_BY_PLAN: Record<keyof typeof PRICE_BY_PLAN, number> = {
  standard: 1,
  family: 4,
  ministry: 10,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = (body?.plan ?? "standard") as keyof typeof PRICE_BY_PLAN;

    // Optional metadata you were already collecting:
    const userId = body?.userId ?? "";
    const orgName = body?.orgName ?? "";

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      console.error("Missing STRIPE_SECRET_KEY");
      return NextResponse.json({ error: "Server misconfigured (stripe key)" }, { status: 500 });
    }

    const priceId = PRICE_BY_PLAN[plan];
    if (!priceId) {
      console.error("Missing price env for plan:", plan);
      return NextResponse.json({ error: `Price for plan '${plan}' is not configured` }, { status: 400 });
    }

    // Initialize Stripe – let SDK use its installed API version
    const stripe = new Stripe(secret);

    const origin = getOrigin(req);
    const seatsMax = SEATS_MAX_BY_PLAN[plan];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1, // Family & Ministry are fixed price regardless of usage
        },
      ],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancelled`,
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: {
        metadata: {
          plan,
          seats_max: String(seatsMax),
          userId,
          orgName,
        },
        trial_period_days: 0,
      },
      metadata: {
        plan,
        seats_max: String(seatsMax),
        userId,
        orgName,
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error?.message ?? "checkout failed" },
      { status: 500 }
    );
  }
}

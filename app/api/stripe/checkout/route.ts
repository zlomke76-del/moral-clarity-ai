// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const SITE = process.env.NEXT_PUBLIC_SITE_URL!;

// Map your real live Price IDs → app tiers
const PRICE_MAP: Record<string, { tier: string; seats: number; memoryGB?: number }> = {
  "price_std_live_123": { tier: "plus", seats: 1 },
  "price_family_live_123": { tier: "pro_family", seats: 4 },
  "price_ministry_live_123": { tier: "ministry", seats: 10 },
  "price_memory1gb_live_123": { tier: "addon_memory", seats: 0, memoryGB: 1 },
};

export async function POST(req: NextRequest) {
  try {
    const { userId, priceId, orgName } = await req.json();

    if (!userId || !priceId) {
      return NextResponse.json({ error: "Missing userId or priceId" }, { status: 400 });
    }

    const plan = PRICE_MAP[priceId];
    if (!plan) {
      return NextResponse.json({ error: "Unknown priceId" }, { status: 400 });
    }

    const idempotencyKey = crypto
      .createHash("sha256")
      .update(`${userId}:${priceId}:${Date.now()}`)
      .digest("hex");

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        allow_promotion_codes: true,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${SITE}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE}/pricing`,
        metadata: {
          userId,
          tier: plan.tier,
          seats: String(plan.seats),
          orgName: orgName ?? "",
          memoryGB: String(plan.memoryGB ?? 0),
        },
      },
      { idempotencyKey }
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}

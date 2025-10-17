import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL!;

// Whitelist Stripe PRICE IDs → internal plan metadata (do NOT trust client)
const PRICE_MAP: Record<string, { tier: string; seats: number; memoryGB?: number }> = {
  // replace with your real live price IDs:
  "price_std_live_123": { tier: "plus", seats: 1 },
  "price_family_live_123": { tier: "pro_family", seats: 4 },
  "price_ministry_live_123": { tier: "ministry", seats: 10 },
  "price_memory1gb_live_123": { tier: "addon_memory", seats: 0, memoryGB: 1 },
};

export async function POST(req: NextRequest) {
  try {
    const { userId, priceId, seats: seatsFromClient, orgName } = await req.json();

    if (!userId || !priceId) {
      return NextResponse.json({ error: "Missing userId or priceId" }, { status: 400 });
    }

    const plan = PRICE_MAP[priceId];
    if (!plan) {
      return NextResponse.json({ error: "Unknown priceId" }, { status: 400 });
    }

    // For safety, ignore client seats unless you explicitly allow overrides.
    const quantity = plan.tier === "addon_memory" ? 1 : 1;

    // Optional: idempotency per user/price (prevents duplicate sessions on double-click)
    const key = crypto
      .createHash("sha256")
      .update(`${userId}:${priceId}:${Date.now()}`) // add time to allow retries later
      .digest("hex");

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        allow_promotion_codes: true,
        line_items: [{ price: priceId, quantity }],
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
      { idempotencyKey: key }
    );

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}

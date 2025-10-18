// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { PLAN_TO_PRICE, PLAN_META, inferPlanFromPriceId, type PlanSlug } from "@/lib/pricing";

// Let Stripe pick the account's default API version to avoid TS literal issues
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://moralclarity.ai";

export async function POST(req: NextRequest) {
  try {
    const { userId, priceId: rawPriceId, orgName, plan: rawPlan } = await req.json();

    // Accept either a plan slug or a priceId
    const plan = (rawPlan as PlanSlug | undefined)?.toLowerCase() as PlanSlug | undefined;
    const priceId = rawPriceId || (plan ? PLAN_TO_PRICE[plan] : undefined);

    // If still no plan, try to infer from priceId
    const canonicalPlan = plan ?? (priceId ? inferPlanFromPriceId(priceId) : null);
    if (!priceId || !canonicalPlan) {
      return NextResponse.json({ error: "Missing plan/priceId" }, { status: 400 });
    }

    const meta = PLAN_META[canonicalPlan];

    // userId is optional; still recorded if present
    const idempotencyKey = crypto
      .createHash("sha256")
      .update(`${userId ?? "anon"}:${priceId}:${Date.now()}`)
      .digest("hex");

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        allow_promotion_codes: true,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${SITE}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE}/subscribe`,
        metadata: {
          ...(userId ? { userId } : {}),
          tier: meta.tier,
          seats: String(meta.seats),
          orgName: orgName ?? "",
          memoryGB: String(meta.memoryGB ?? 0),
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


// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PLAN_TO_PRICE, PLAN_META, inferPlanFromPriceId, type PlanSlug } from "@/lib/pricing";

type StripeCtor = typeof import("stripe").default;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const Stripe = (require("stripe") as { default: StripeCtor }).default;
  // Let Stripe choose default account API version
  return new Stripe(key);
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://moralclarity.ai";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
    }

    const { userId, priceId: rawPriceId, orgName, plan: rawPlan } = await req.json();

    const plan = (rawPlan as PlanSlug | undefined)?.toLowerCase() as PlanSlug | undefined;
    const priceId = rawPriceId || (plan ? PLAN_TO_PRICE[plan] : undefined);

    const canonicalPlan = plan ?? (priceId ? inferPlanFromPriceId(priceId) : null);
    if (!priceId || !canonicalPlan) {
      return NextResponse.json({ error: "Missing plan/priceId" }, { status: 400 });
    }

    const meta = PLAN_META[canonicalPlan];

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

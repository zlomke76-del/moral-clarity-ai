// app/buy/[plan]/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PLAN_TO_PRICE, PLAN_META, type PlanSlug } from "@/lib/pricing";

export async function GET(
  _req: Request,
  { params }: { params: { plan: string } }
) {
  const plan = params.plan?.toLowerCase() as PlanSlug | undefined;
  if (!plan || !(plan in PLAN_TO_PRICE)) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const priceId = PLAN_TO_PRICE[plan];
  const meta = PLAN_META[plan];

  // Let Stripe SDK use the account's default API version (prevents TS literal mismatch)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://moralclarity.ai";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    allow_promotion_codes: true,
    line_items: [{ price: priceId, quantity: 1 }],
    // Use your existing success route name to avoid breaking links
    success_url: `${site}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/subscribe`,
    metadata: {
      tier: meta.tier,
      seats: String(meta.seats),
      memoryGB: String(meta.memoryGB ?? 0),
    },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}

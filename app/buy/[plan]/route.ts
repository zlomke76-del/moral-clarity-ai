// app/buy/[plan]/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PLAN_TO_PRICE, PLAN_META, type PlanSlug } from "@/lib/pricing";

// Make sure this route runs on Node (Stripe needs raw Node runtime, not edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Let Stripe use the account's default API version (avoids TS literal mismatch).
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Point to your app domain (set this per-environment in Vercel):
  //  - Staging:  https://staging.moralclarity.ai
  //  - Prod app: https://app.moralclarity.ai  (or https://moralclarity.ai if the app serves the apex)
  const site =
    process.env.NEXT_PUBLIC_SITE_URL || "https://staging.moralclarity.ai";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    allow_promotion_codes: true,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${site}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/subscribe`,
    metadata: {
      tier: meta.tier,
      seats: String(meta.seats),
      memoryGB: String(meta.memoryGB ?? 0),
    },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}

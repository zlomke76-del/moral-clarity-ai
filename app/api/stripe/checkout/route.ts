// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Comma-separated list of allowed referer prefixes (scheme + host)
const ALLOWED = (process.env.ALLOWED_CHECKOUT_REFERRERS ||
  "http://localhost,https://moral-clarity-ai.vercel.app,https://moral-clarity-ai-2-0.webflow.io")
  .split(",")
  .map((s) => s.trim());

function isAllowed(req: NextRequest) {
  const referer = req.headers.get("referer") || "";
  return ALLOWED.some((prefix) => referer.startsWith(prefix));
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowed(req)) {
      // You can temporarily comment this out during testing:
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, successUrl, cancelUrl } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Checkout failed" },
      { status: 400 }
    );
  }
}

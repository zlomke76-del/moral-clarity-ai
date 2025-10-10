// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// --- Allow everything temporarily so we can test embedding safely ---
export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    // 🔹 Skip origin check entirely (for Webflow + direct testing)
    // Once it’s stable, we can re-add soft validation if you want.

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

    // ✅ Return Stripe redirect URL to the client
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Checkout failed" },
      { status: 400 }
    );
  }
}

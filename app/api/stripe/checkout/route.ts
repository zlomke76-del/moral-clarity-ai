// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Helper: parse comma-separated origins and trim
function getAllowedOrigins(): string[] {
  const v =
    process.env.ALLOWED_ORIGIN_WF ??
    process.env.ALLOWED_ORIGIN ??  // fallback if you ever add it back
    "";
  return v
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  // ✅ Soft origin check using your new var
  const allowed = getAllowedOrigins();
  const referer = req.headers.get("referer") || "";
  const ok =
    allowed.length === 0 ||
    allowed.some(origin => referer.startsWith(origin));

  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { priceId, successUrl, cancelUrl } = await req.json();
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

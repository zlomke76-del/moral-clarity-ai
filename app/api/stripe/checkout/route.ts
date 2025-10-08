// app/api/stripe/checkout/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

function getOrigin(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;

  const vercelHost = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercelHost) return `https://${vercelHost}`;

  // Fallback to request headers (dev/local)
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    const { userId = null, seats = 1, orgName = null } = await req.json().catch(() => ({}));

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      console.error("Missing STRIPE_SECRET_KEY");
      return NextResponse.json({ error: "Server misconfigured (stripe key)" }, { status: 500 });
    }

    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      console.error("Missing STRIPE_PRICE_ID_PRO");
      return NextResponse.json({ error: "Server misconfigured (price id)" }, { status: 500 });
    }

    // Initialize Stripe at request time to avoid build-time crashes
    const stripe = new Stripe(secret);

    const origin = getOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: Number(seats) || 1 }],
      metadata: {
        userId: userId ?? "",
        orgName: orgName ?? "",
      },
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`,
      subscription_data: {
        trial_period_days: 0,
      },
      allow_promotion_codes: true,
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

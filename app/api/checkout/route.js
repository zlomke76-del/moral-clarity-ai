import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";       // avoid Edge runtime stalls
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { priceId } = await req.json();      // <-- must be JSON
    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/canceled`,
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    const msg = err?.message || "Checkout error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

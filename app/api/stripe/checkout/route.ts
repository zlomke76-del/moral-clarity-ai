// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { randomUUID } from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// This route is called by your frontend when user clicks "Upgrade" or "Buy Team Plan"
export async function POST(req: NextRequest) {
  try {
    const { userId, priceId, seats = 1, orgName, orgId } = await req.json();

    if (!userId || !priceId) {
      return NextResponse.json({ error: "Missing userId or priceId" }, { status: 400 });
    }

    // If this is a new org checkout, generate one now
    const finalOrgId = orgId ?? randomUUID();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,             // the Stripe price id (pro/ministry/team)
          quantity: Math.max(1, Number(seats || 1)), // seat count
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/cancel`,
      allow_promotion_codes: true,
      metadata: {
        user_id: userId,
        org_id: finalOrgId,
        org_name: orgName ?? "",
      },
      customer_creation: "always",
      customer_update: { address: "auto", name: "auto" },
    });

    return NextResponse.json({ url: session.url, orgId: finalOrgId });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

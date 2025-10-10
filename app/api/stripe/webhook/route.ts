// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = headers().get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    // Construct Stripe client only inside the handler (no apiVersion literal to dodge TS mismatch)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    // Handle events you care about (add your DB logic here)
    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "invoice.paid":
      case "invoice.payment_failed":
        // TODO: upsert to Supabase, etc.
        break;
      default:
        // no-op
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err?.message ?? err);
    return NextResponse.json({ error: `Webhook Error: ${err?.message ?? "unknown"}` }, { status: 400 });
  }
}

export async function GET() {
  // Optional health check
  return NextResponse.json({ ok: true });
}

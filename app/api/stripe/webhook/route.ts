export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: This file MUST stay self-contained.
//   • Do NOT import anything from "@/lib/*" or re-exported barrels.
//   • No OpenAI imports here.
// ─────────────────────────────────────────────────────────────────────────────

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  // Handle events you care about
  switch (event.type) {
    case "checkout.session.completed":
      // TODO: fulfill subscription, mark user active, etc.
      break;
    case "customer.subscription.deleted":
      // TODO: mark user inactive
      break;
    default:
      // no-op
      break;
  }

  return NextResponse.json({ received: true });
}

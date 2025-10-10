// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * Keep this file self-contained. Do NOT import from "@/lib/*".
 * Make sure STRIPE_WEBHOOK_SECRET is set in Vercel.
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  // IMPORTANT: use the raw body
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle events you care about
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: fulfill, provision, or record subscription in your DB
      // e.g., session.client_reference_id, session.customer, session.subscription, etc.
      break;
    }
    // add other event types as needed
    default:
      // no-op
      break;
  }

  // Stripe needs a 2xx to consider delivery successful
  return new NextResponse(null, { status: 200 });
}

// Stripe sends GET pings occasionally; respond OK
export async function GET() {
  return new NextResponse('OK', { status: 200 });
}

// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle events you care about
  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: mark user as active, etc.
      break;
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      // TODO: sync subscription state
      break;
  }

  return NextResponse.json({ received: true });
}
export async function GET() {
  return NextResponse.json({ ok: true });
}

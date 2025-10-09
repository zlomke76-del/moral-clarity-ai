export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// ⚠️ Keep this file self-contained. Do NOT import from "@/lib/*" anywhere.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') ?? '';
  const raw = await req.arrayBuffer();

  try {
    const event = stripe.webhooks.constructEvent(Buffer.from(raw), sig, endpointSecret);

    // TODO: handle event types you care about
    // if (event.type === 'checkout.session.completed') { ... }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature failed: ${err.message}` },
      { status: 400 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Example: upsert to Supabase or log events (customize as needed)
async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('✅ Checkout complete:', event.data.object.id);
      // TODO: upsert subscription in Supabase
      break;
    case 'customer.subscription.updated':
      console.log('🔁 Subscription updated:', event.data.object.id);
      break;
    case 'customer.subscription.deleted':
      console.log('❌ Subscription canceled:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
  } catch (err: any) {
    console.error('❗ Invalid signature:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    await handleEvent(event);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('❗ Webhook handler error:', err);
    return new NextResponse('Webhook handler error', { status: 500 });
  }
}

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto'; // small addition here

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Allow only your three known LIVE prices
const ALLOWED_PRICES = new Set([
  process.env.PRICE_LIVE_STANDARD!,
  process.env.PRICE_LIVE_FAMILY!,
  process.env.PRICE_LIVE_MINISTRY!,
]);

const SITE = process.env.SITE_URL ?? 'https://www.moralclarityai.com';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const price = searchParams.get('price') || '';

  if (!ALLOWED_PRICES.has(price)) {
    return NextResponse.json({ error: 'Unknown price' }, { status: 400 });
  }

  // Generate a random reference for auditing
  const clientRef = crypto.randomUUID();

  // Create the checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    success_url: `${SITE}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE}/#pricing`,
    client_reference_id: clientRef,
    allow_promotion_codes: true,
    metadata: { source: 'webflow_pricing' },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // don’t attempt to prerender

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';

// No apiVersion literal -> avoid type mismatch churn
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Keep this local and simple; no shared libs that might init OpenAI
const ALLOWED_PRICES = new Set(
  [
    process.env.PRICE_LIVE_STANDARD,
    process.env.PRICE_LIVE_FAMILY,
    process.env.PRICE_LIVE_MINISTRY,
    process.env.PRICE_TEST_STANDARD,
    process.env.PRICE_TEST_FAMILY,
    process.env.PRICE_TEST_MINISTRY,
  ].filter(Boolean) as string[]
);

const SITE = process.env.SITE_URL ?? 'https://moral-clarity-ai-2-0.webflow.io';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const price = searchParams.get('price') ?? '';

  if (!ALLOWED_PRICES.has(price)) {
    return NextResponse.json({ error: 'Unknown price' }, { status: 400 });
  }

  const clientRef = crypto.randomUUID();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    success_url: `${SITE}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE}/#pricing`,
    client_reference_id: clientRef,
    allow_promotion_codes: true,
    metadata: { source: 'webflow_v2' },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}


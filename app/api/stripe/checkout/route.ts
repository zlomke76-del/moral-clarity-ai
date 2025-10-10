// Runtime hints — keep this node/server and dynamic so Next won't try to statically analyze
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: This file MUST stay self-contained.
//   • Do NOT import anything from "@/lib/*" or re-exported barrels.
//   • No OpenAI imports here.
// ─────────────────────────────────────────────────────────────────────────────

// Server-side env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

// Allowed live/test price ids (fill with your actual ids)
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

// Where to send users back (staging ok). You can also set SITE_URL in Vercel.
const SITE = process.env.SITE_URL ?? "https://moral-clarity-ai-2-0.webflow.io";

export async function GET(req: NextRequest) {
  // read price param
  const url = new URL(req.url);
  const price = url.searchParams.get("price") ?? "";

  if (!ALLOWED_PRICES.has(price)) {
    return NextResponse.json({ error: "Unknown price" }, { status: 400 });
  }

  const clientRef = crypto.randomUUID();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${SITE}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE}/pricing`,
    client_reference_id: clientRef,
    allow_promotion_codes: true,
    metadata: { source: "webflow_v2" },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}

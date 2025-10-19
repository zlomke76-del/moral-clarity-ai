// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const toISO = (secs?: number | null) =>
  secs ? new Date(secs * 1000).toISOString() : null;

// Include period fields for safety
type SubWithPeriods = Stripe.Subscription & {
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
};

function extractFromSubscription(subRaw: Stripe.Subscription) {
  const sub = subRaw as SubWithPeriods;
  const item = sub.items?.data?.[0];

  return {
    // Stripe identifiers
    stripe_subscription_id: sub.id,
    stripe_customer_id: String(sub.customer),
    customer_id: String(sub.customer), // you have both in the table

    // State
    status: sub.status,
    price_id: item?.price?.id ?? null,      // your table has price_id
    stripe_price_id: item?.price?.id ?? null, // and also stripe_price_id (mirror to both)
    quantity: item?.quantity ?? null,

    // Periods
    current_period_start: toISO(sub.current_period_start ?? null),
    current_period_end: toISO(sub.current_period_end ?? null),
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
  };
}

async function upsertSubscriptionFromStripe(subRaw: Stripe.Subscription) {
  const sb = createSupabaseAdmin();
  const data = extractFromSubscription(subRaw);

  const row = {
    ...data,
    updated: new Date().toISOString(),
  };

  // IMPORTANT: upsert on your actual unique key
  const { error } = await sb
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" });

  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // use account’s pinned API version
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: `Signature verification failed: ${e.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        // Retrieve the full subscription and persist
        const sub = await stripe.subscriptions.retrieve(String(session.subscription));
        await upsertSubscriptionFromStripe(sub);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(sub);
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        // Optional: mirror invoice info if you want later
        break;
      }

      default:
        // no-op for other events
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json({ error: err.message ?? "Unhandled error" }, { status: 500 });
  }
}

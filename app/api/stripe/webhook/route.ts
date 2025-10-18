// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Util: convert Stripe epoch seconds → ISO string */
const toISO = (secs?: number | null) =>
  secs ? new Date(secs * 1000).toISOString() : null;

/** Persist/refresh a subscription row in Supabase */
async function upsertSubscription(params: {
  id: string;                         // Stripe subscription id
  customer_id: string;                // Stripe customer id
  status: string;                     // active | trialing | past_due | canceled | ...
  price_id?: string | null;
  quantity?: number | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
}) {
  const sb = createSupabaseAdmin();

  const row = {
    id: params.id,
    customer_id: params.customer_id,
    status: params.status,
    price_id: params.price_id ?? null,
    quantity: params.quantity ?? null,
    current_period_start: toISO(params.current_period_start),
    current_period_end: toISO(params.current_period_end),
    cancel_at_period_end: params.cancel_at_period_end ?? false,
    updated: new Date().toISOString(),
  };

  // `onConflict: id` requires a UNIQUE/PK on id (which you likely have).
  const { error } = await sb.from("subscriptions").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

/** Pull key details from a Stripe.Subscription */
function extractFromSubscription(sub: Stripe.Subscription) {
  const item = sub.items?.data?.[0];
  return {
    id: sub.id,
    customer_id: String(sub.customer),
    status: sub.status,
    price_id: item?.price?.id ?? null,
    quantity: item?.quantity ?? null,
    current_period_start: sub.current_period_start,
    current_period_end: sub.current_period_end,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
  };
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // IMPORTANT: raw body for Stripe signature verification
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
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
      /** User finished Checkout successfully */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only care if it's a subscription checkout
        if (session.mode !== "subscription") break;

        // Get the real subscription (has period dates, price, etc.)
        if (!session.subscription) break;
        const sub = await stripe.subscriptions.retrieve(
          String(session.subscription)
        );

        await upsertSubscription(extractFromSubscription(sub));
        break;
      }

      /** Subscription lifecycle events */
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(extractFromSubscription(sub));
        break;
      }

      /** Optional: track invoice outcomes */
      case "invoice.paid":
      case "invoice.payment_failed": {
        // You could persist invoice state if you want.
        break;
      }

      default:
        // No-op for other events.
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json({ error: err.message ?? "Unhandled error" }, { status: 500 });
  }
}

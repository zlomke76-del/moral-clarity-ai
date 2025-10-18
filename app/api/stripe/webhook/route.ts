// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Convert Stripe epoch seconds → ISO string */
const toISO = (secs?: number | null) =>
  secs ? new Date(secs * 1000).toISOString() : null;

/** A helper type that includes the period fields (some Stripe type dists omit them) */
type SubWithPeriods = Stripe.Subscription & {
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
};

/** Persist/refresh a subscription row in Supabase */
async function upsertSubscription(params: {
  id: string; // Stripe subscription id
  customer_id: string;
  status: string;
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

  const { error } = await sb.from("subscriptions").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

/** Pull key details safely from a Stripe.Subscription */
function extractFromSubscription(subRaw: Stripe.Subscription) {
  const sub = subRaw as SubWithPeriods;
  const item = sub.items?.data?.[0];
  return {
    id: sub.id,
    customer_id: String(sub.customer),
    status: sub.status,
    price_id: item?.price?.id ?? null,
    quantity: item?.quantity ?? null,
    current_period_start: sub.current_period_start ?? null,
    current_period_end: sub.current_period_end ?? null,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
  };
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

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
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode !== "subscription") break;
        if (!session.subscription) break;

        const sub = await stripe.subscriptions.retrieve(String(session.subscription));
        await upsertSubscription(extractFromSubscription(sub));
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(extractFromSubscription(sub));
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        // Optional: mirror invoice state if you want
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json({ error: err.message ?? "Unhandled error" }, { status: 500 });
  }
}

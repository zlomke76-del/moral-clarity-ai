// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";          // ensure Node runtime for raw body/crypto
export const dynamic = "force-dynamic";   // don't cache webhook responses

/** Convert Stripe epoch seconds → ISO string (nullable safe) */
const toISO = (secs?: number | null) =>
  secs ? new Date(secs * 1000).toISOString() : null;

/** Some Stripe dists omit the period fields; add them here for safety */
type SubWithPeriods = Stripe.Subscription & {
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
};

/** Upsert our canonical subscription row in Supabase */
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
    updated: new Date().toISOString(), // your table has `updated`
  };

  const { error } = await sb.from("subscriptions").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

/** Safely extract fields we care about from a Stripe.Subscription */
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

/** Optional: react to invoice events (no-op now but keeps 200s flowing) */
async function handleInvoiceEvent(
  _sb: ReturnType<typeof createSupabaseAdmin>,
  _inv: Stripe.Invoice
) {
  // If you want to mirror invoice state or last_payment_id into your DB,
  // do it here. Keeping as a no-op so webhook returns 200 fast.
}

export async function POST(req: Request) {
  // Let Stripe SDK use the account’s pinned API version (avoids TS union issues)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // IMPORTANT: read the raw text body for signature verification
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
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
    const sb = createSupabaseAdmin();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only handle subscription checkouts
        if (session.mode !== "subscription" || !session.subscription) break;

        // session.subscription can be `string | Subscription`
        const sub =
          typeof session.subscription === "string"
            ? await stripe.subscriptions.retrieve(session.subscription)
            : (session.subscription as Stripe.Subscription);

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
        const inv = event.data.object as Stripe.Invoice;
        await handleInvoiceEvent(sb, inv);
        break;
      }

      // Unhandled types still return 200 so Stripe doesn't retry forever
      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Make sure we return 200s for non-critical paths if desired, but since this
    // is our core sync we surface the error to Stripe as 500 to trigger retries.
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unhandled webhook error" },
      { status: 500 }
    );
  }
}

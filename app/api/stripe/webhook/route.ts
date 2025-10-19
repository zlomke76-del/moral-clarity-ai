// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Convert Stripe epoch seconds → ISO string (or null). */
const toISO = (secs?: number | null) =>
  typeof secs === "number" ? new Date(secs * 1000).toISOString() : null;

/** Narrow subscription core fields in a safe way */
function unpackSubscription(sub: Stripe.Subscription) {
  const firstItem = sub.items?.data?.[0];
  const price = firstItem?.price ?? null;

  return {
    subId: sub.id,
    customerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
    status: sub.status ?? "incomplete",
    priceId: price?.id ?? null,
    quantity: firstItem?.quantity ?? null,
    currentPeriodStart: (sub as any).current_period_start ?? null, // Stripe types sometimes omit
    currentPeriodEnd: (sub as any).current_period_end ?? null,
    cancelAtPeriodEnd: (sub as any).cancel_at_period_end ?? false,
    createdAt: (sub as any).created ?? null, // epoch seconds
  };
}

/** Upsert the raw mirror row into public.stripe_subscriptions */
async function upsertStripeSubscriptionsMirror(sb: ReturnType<typeof createSupabaseAdmin>, sub: Stripe.Subscription) {
  const u = unpackSubscription(sub);

  const row = {
    id: u.subId, // PRIMARY KEY or unique
    user_id: null, // if you map later
    customer_id: u.customerId,
    status: u.status,
    price_id: u.priceId,
    quantity: u.quantity,
    current_period_start: toISO(u.currentPeriodStart),
    current_period_end: toISO(u.currentPeriodEnd),
    cancel_at_period_end: !!u.cancelAtPeriodEnd,
    created: toISO(u.createdAt) ?? new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  const { error } = await sb
    .from("stripe_subscriptions")
    .upsert(row, { onConflict: "id" });

  if (error) {
    throw new Error(`stripe_subscriptions upsert failed: ${error.message}`);
  }
}

/** Upsert your canonical app-wide row into public.subscriptions */
async function upsertWideSubscriptionsRow(sb: ReturnType<typeof createSupabaseAdmin>, sub: Stripe.Subscription) {
  const u = unpackSubscription(sub);

  const row = {
    stripe_subscription_id: u.subId,
    stripe_customer_id: u.customerId,
    status: u.status,
    // the wide table ALSO has these “flat” columns per your schema
    customer_id: u.customerId,
    price_id: u.priceId,
    quantity: u.quantity,
    current_period_start: toISO(u.currentPeriodStart),
    current_period_end: toISO(u.currentPeriodEnd),
    cancel_at_period_end: !!u.cancelAtPeriodEnd,
    updated: new Date().toISOString(),
    // If you have a created column and want to set it only on first insert, Postgres will keep the existing value on conflict
    created: toISO(u.createdAt) ?? new Date().toISOString(),
  };

  const { error } = await sb
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" });

  if (error) {
    throw new Error(`subscriptions upsert failed: ${error.message}`);
  }
}

/** Handle an invoice event (optionally mirror last_payment_id, etc.) */
async function handleInvoiceEvent(sb: ReturnType<typeof createSupabaseAdmin>, inv: Stripe.Invoice) {
  const subId = typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id;
  if (!subId) return;

  const lastPaymentId =
    typeof inv.payment_intent === "string" ? inv.payment_intent : inv.payment_intent?.id ?? null;

  // Only update the wide table’s last_payment_id if it exists in your schema (it does per your dump)
  const { error } = await sb
    .from("subscriptions")
    .update({
      last_payment_id: lastPaymentId,
      updated: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subId);

  if (error) {
    // Don’t fail the webhook on a soft/optional update
    console.warn("[stripe-webhook] invoice mirror update warning:", error.message);
  }
}

/** Safely fetch & mirror a subscription (by id) to both tables */
async function mirrorSubscriptionById(stripe: Stripe, sb: ReturnType<typeof createSupabaseAdmin>, subId: string) {
  const sub = await stripe.subscriptions.retrieve(subId);
  await upsertStripeSubscriptionsMirror(sb, sub);
  await upsertWideSubscriptionsRow(sb, sub);
}

export async function POST(req: Request) {
  // 1) Stripe + signature
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // optional, but helps keep consistent payloads with dashboard version
    apiVersion: "2025-08-27.basil",
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  // In Next.js App Router, the body is still raw; use text() for constructEvent
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Signature verification failed: ${err?.message ?? "unknown"}` },
      { status: 400 }
    );
  }

  // 2) Supabase admin client
  const sb = createSupabaseAdmin();

  // 3) Handle events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // subscriptions only
        if (session.mode === "subscription" && session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          await mirrorSubscriptionById(stripe, sb, subId);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        // mirror straight from payload (no extra fetch required)
        await upsertStripeSubscriptionsMirror(sb, sub);
        await upsertWideSubscriptionsRow(sb, sub);
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoiceEvent(sb, invoice);
        break;
      }

      // You can add more granular handlers here as you wish:
      // - "payment_intent.succeeded"
      // - "invoice.finalized"
      // - etc.

      default: {
        // Make the endpoint idempotent & quiet for unhandled types
        // console.log("[stripe-webhook] Unhandled event type:", event.type);
        break;
      }
    }

    // Stripe requires a 2xx to stop retrying
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error:", err);
    // Return 200 with ok:false to stop endless retries if the error is non-critical
    // but for now we return 500 so you notice it in Stripe logs:
    return NextResponse.json(
      { error: err?.message ?? "Unhandled webhook error" },
      { status: 500 }
    );
  }
}

/** Optional: make GET explicit 405 so browser visits aren’t “404 not found” */
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

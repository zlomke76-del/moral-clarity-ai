// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const toISO = (secs?: number | null) =>
  typeof secs === "number" ? new Date(secs * 1000).toISOString() : null;

function unpackSubscription(sub: Stripe.Subscription) {
  const firstItem = sub.items?.data?.[0];
  const price = firstItem?.price ?? null;

  return {
    subId: sub.id,
    customerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
    status: sub.status ?? "incomplete",
    priceId: price?.id ?? null,
    quantity: firstItem?.quantity ?? null,
    currentPeriodStart: (sub as any).current_period_start ?? null,
    currentPeriodEnd: (sub as any).current_period_end ?? null,
    cancelAtPeriodEnd: (sub as any).cancel_at_period_end ?? false,
    createdAt: (sub as any).created ?? null,
  };
}

async function upsertStripeSubscriptionsMirror(
  sb: ReturnType<typeof createSupabaseAdmin>,
  sub: Stripe.Subscription
) {
  const u = unpackSubscription(sub);

  const row = {
    id: u.subId,
    user_id: null,
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

  const { error } = await sb.from("stripe_subscriptions").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`stripe_subscriptions upsert failed: ${error.message}`);
}

async function upsertWideSubscriptionsRow(
  sb: ReturnType<typeof createSupabaseAdmin>,
  sub: Stripe.Subscription
) {
  const u = unpackSubscription(sub);

  const row = {
    stripe_subscription_id: u.subId,
    stripe_customer_id: u.customerId,
    status: u.status,
    customer_id: u.customerId,
    price_id: u.priceId,
    quantity: u.quantity,
    current_period_start: toISO(u.currentPeriodStart),
    current_period_end: toISO(u.currentPeriodEnd),
    cancel_at_period_end: !!u.cancelAtPeriodEnd,
    updated: new Date().toISOString(),
    created: toISO(u.createdAt) ?? new Date().toISOString(),
  };

  const { error } = await sb
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" });
  if (error) throw new Error(`subscriptions upsert failed: ${error.message}`);
}

async function handleInvoiceEvent(
  sb: ReturnType<typeof createSupabaseAdmin>,
  inv: Stripe.Invoice
) {
  // Some Stripe TS dists don’t expose these fields → read via `any`
  const invAny = inv as any;

  const subId: string | undefined =
    typeof invAny.subscription === "string"
      ? invAny.subscription
      : invAny.subscription?.id;

  if (!subId) return;

  const lastPaymentId: string | null =
    typeof invAny.payment_intent === "string"
      ? invAny.payment_intent
      : invAny.payment_intent?.id ?? null;

  const { error } = await sb
    .from("subscriptions")
    .update({
      last_payment_id: lastPaymentId,
      updated: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subId);

  if (error) console.warn("[stripe-webhook] invoice mirror update warning:", error.message);
}

async function mirrorSubscriptionById(
  stripe: Stripe,
  sb: ReturnType<typeof createSupabaseAdmin>,
  subId: string
) {
  const sub = await stripe.subscriptions.retrieve(subId);
  await upsertStripeSubscriptionsMirror(sb, sub);
  await upsertWideSubscriptionsRow(sb, sub);
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

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

  const sb = createSupabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
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

      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unhandled webhook error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Adjust names here if your columns differ */
const MAP = {
  userStripeCustomers: {
    table: "user_stripe_customers",
    userId: "user_id",
    customerId: "stripe_customer_id",
  },
  subscriptions: {
    table: "subscriptions",
    userId: "user_id",
    customerId: "stripe_customer_id",
    subscriptionId: "stripe_subscription_id",
    status: "status",
    priceId: "price_id",
    currentPeriodEnd: "current_period_end",
    updatedAt: "updated_at",
  },
  payments: {
    table: "payments",
    invoiceId: "stripe_invoice_id",
    customerId: "stripe_customer_id",
    subscriptionId: "stripe_subscription_id",
    amountDue: "amount_due",
    amountPaid: "amount_paid",
    status: "status",
    createdAt: "created_at",
  },
};

function toIso(ts?: number | null) {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function linkCustomer(userId: string | null, stripeCustomerId: string) {
  const payload: Record<string, any> = {
    [MAP.userStripeCustomers.userId]: userId,
    [MAP.userStripeCustomers.customerId]: stripeCustomerId,
  };
  await supabaseAdmin
    .from(MAP.userStripeCustomers.table)
    .upsert(payload, { onConflict: MAP.userStripeCustomers.customerId });
}

// Relax type only where local Stripe typings are missing fields
async function upsertSubscription(sub: Stripe.Subscription, userId?: string | null) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const priceId =
    (sub.items?.data?.[0]?.price as any)?.id ??
    (sub.items?.data?.[0] as any)?.price_id ??
    null;

  const periodEnd =
    (sub as unknown as { current_period_end?: number | null }).current_period_end ?? null;

  const payload: Record<string, any> = {
    [MAP.subscriptions.userId]: userId ?? null,
    [MAP.subscriptions.customerId]: customerId,
    [MAP.subscriptions.subscriptionId]: sub.id,
    [MAP.subscriptions.status]: sub.status,
    [MAP.subscriptions.priceId]: priceId,
    [MAP.subscriptions.currentPeriodEnd]: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    [MAP.subscriptions.updatedAt]: new Date().toISOString(),
  };

  await supabaseAdmin
    .from(MAP.subscriptions.table)
    .upsert(payload, { onConflict: MAP.subscriptions.subscriptionId });
}

async function logPayment(inv: Stripe.Invoice) {
  const customerId =
    typeof inv.customer === "string" ? inv.customer : inv.customer?.id ?? null;

  // typings workaround: invoice.subscription may be missing in your Stripe types
  const subField = (inv as unknown as { subscription?: string | { id?: string } | null }).subscription;
  const subscriptionId =
    typeof subField === "string"
      ? subField
      : subField && typeof subField === "object" && "id" in subField
      ? (subField as any).id
      : null;

  const payload: Record<string, any> = {
    [MAP.payments.invoiceId]: inv.id,
    [MAP.payments.customerId]: customerId,
    [MAP.payments.subscriptionId]: subscriptionId,
    [MAP.payments.amountDue]: inv.amount_due ?? null,
    [MAP.payments.amountPaid]: inv.amount_paid ?? null,
    [MAP.payments.status]: inv.status ?? null,
    [MAP.payments.createdAt]: new Date().toISOString(),
  };

  // If you enforce uniqueness on invoice_id, change to upsert.
  await supabaseAdmin.from(MAP.payments.table).insert(payload).catch(() => null);
}

export async function POST(req: NextRequest) {
  const sig = headers().get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const rawBody = await req.text();

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = (s.metadata?.user_id as string | undefined) ?? null;
        const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
        if (customerId) await linkCustomer(userId, customerId);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(sub);
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        await logPayment(inv);

        // Keep subscriptions table in sync with the invoice's subscription
        const subField = (inv as unknown as { subscription?: string | { id?: string } | null }).subscription;
        const subId =
          typeof subField === "string"
            ? subField
            : subField && typeof subField === "object" && "id" in subField
            ? (subField as any).id
            : null;

        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(sub);
        }
        break;
      }

      default: {
        // ignore others for now
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[stripe:webhook] error", err?.message ?? err);
    return NextResponse.json(
      { error: `Webhook Error: ${err?.message ?? "unknown"}` },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

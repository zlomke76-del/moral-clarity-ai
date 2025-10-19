// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Convert Stripe epoch seconds → ISO string */
const toISO = (secs?: number | null) =>
  secs ? new Date(secs * 1000).toISOString() : null;

/** Some Stripe dists omit period fields; extend for safety */
type SubWithPeriods = Stripe.Subscription & {
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
};

type SubUpsert = {
  id: string;                    // Stripe subscription id
  user_id?: string | null;       // profiles.id (nullable if not known)
  customer_id: string;           // Stripe customer id
  status: string;
  price_id?: string | null;
  quantity?: number | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
};

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

/** Try to find (or create+link) a profile for this Stripe customer */
async function resolveUserIdAndMaybeLinkProfile(opts: {
  customerId: string;
  email?: string | null;
}) {
  const sb = createSupabaseAdmin();

  // 1) First try by stripe_customer_id
  const { data: byCustomer, error: byCustomerErr } = await sb
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", opts.customerId)
    .limit(1)
    .maybeSingle();

  if (!byCustomerErr && byCustomer?.id) {
    return byCustomer.id as string;
  }

  // 2) If we have an email, try to find profile by email and backfill stripe_customer_id
  if (opts.email) {
    const { data: byEmail, error: byEmailErr } = await sb
      .from("profiles")
      .select("id,stripe_customer_id")
      .eq("email", opts.email.toLowerCase())
      .limit(1)
      .maybeSingle();

    if (!byEmailErr && byEmail?.id) {
      // If not linked yet, link it
      if (!byEmail.stripe_customer_id) {
        await sb
          .from("profiles")
          .update({ stripe_customer_id: opts.customerId, updated_at: new Date().toISOString() })
          .eq("id", byEmail.id);
      }
      return byEmail.id as string;
    }
  }

  // 3) No profile found (that's OK—return null, caller may store NULL user_id)
  return null;
}

/** Persist/refresh a subscription row in Supabase */
async function upsertSubscription(params: SubUpsert) {
  const sb = createSupabaseAdmin();

  const row = {
    id: params.id,
    user_id: params.user_id ?? null,
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

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecret);
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (e: any) {
    return NextResponse.json(
      { error: `Signature verification failed: ${e?.message ?? "invalid signature"}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only care about subscriptions
        if (session.mode !== "subscription" || !session.subscription) break;

        // 1) Persist subscription
        const sub = await stripe.subscriptions.retrieve(String(session.subscription));
        const minimal = extractFromSubscription(sub);

        // 2) Resolve user_id from profile (try by customer id, then email)
        const emailFromSession = session.customer_details?.email ?? undefined;
        const userId = await resolveUserIdAndMaybeLinkProfile({
          customerId: minimal.customer_id,
          email: emailFromSession,
        });

        await upsertSubscription({ ...minimal, user_id: userId ?? null });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const minimal = extractFromSubscription(sub);

        // Try to resolve user by known link; we likely won’t have email in these events
        const userId = await resolveUserIdAndMaybeLinkProfile({
          customerId: minimal.customer_id,
          email: undefined,
        });

        await upsertSubscription({ ...minimal, user_id: userId ?? null });
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        // Optional: mirror invoice state if desired.
        break;
      }

      default:
        // No-op for unrelated events
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unhandled error" },
      { status: 500 }
    );
  }
}

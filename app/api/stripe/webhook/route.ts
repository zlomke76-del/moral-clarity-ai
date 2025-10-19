// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---------- helpers ---------- */

const toISO = (secs?: number | null) =>
  typeof secs === "number" ? new Date(secs * 1000).toISOString() : null;

type SubWithPeriods = Stripe.Subscription & {
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
};

function extractFromSubscription(subRaw: Stripe.Subscription) {
  const sub = subRaw as SubWithPeriods;
  const item = sub.items?.data?.[0];
  return {
    stripe_subscription_id: sub.id,
    stripe_customer_id: String(sub.customer),
    status: sub.status,
    price_id: item?.price?.id ?? null,
    quantity: item?.quantity ?? null,
    current_period_start: sub.current_period_start ?? null,
    current_period_end: sub.current_period_end ?? null,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
  };
}

/* ---------- email (Resend via REST) ---------- */

async function sendResendEmail(opts: {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY!;
  const RESEND_FROM =
    opts.from ??
    process.env.RESEND_FROM ?? // e.g. 'Moral Clarity AI Support <support@moralclarity.ai>'
    "Moral Clarity AI <noreply@moralclarity.ai>";

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`Resend failed (${r.status}): ${txt}`);
  }
}

/* ---------- magic link invite (Supabase) ---------- */

async function sendMagicLinkInvite(email: string) {
  const sb = createSupabaseAdmin();

  const { data, error } = await sb.auth.admin.generateLink({
    type: "magiclink",
    email,
    // options: { redirectTo: "https://moralclarity.ai/app" },
  });
  if (error) throw error;

  // Supabase's returned properties contain a link but the type
  // doesn't list every possible field—read defensively.
  const props = (data?.properties ?? {}) as Record<string, unknown>;
  const link =
    (props.action_link as string | undefined) ??
    (props.email_otp_link as string | undefined) ??
    (props.magic_link as string | undefined) ??
    (props.invite_link as string | undefined);

  if (!link) throw new Error("Could not generate magic link URL");

  await sendResendEmail({
    to: [email],
    subject: "Welcome to Moral Clarity AI — Your Sign-In Link",
    html: `
      <p>Welcome! Click the button below to sign in:</p>
      <p><a href="${link}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#5c7cfa;color:#fff;text-decoration:none;">Sign in</a></p>
      <p>If the button doesn’t work, copy & paste this URL:<br/><code>${link}</code></p>
    `,
  });
}

/* ---------- subscription persistence ---------- */

async function resolveUserIdForCustomer(params: {
  stripe_customer_id: string;
  stripe: Stripe;
}) {
  const { stripe_customer_id, stripe } = params;
  const sb = createSupabaseAdmin();

  // 1) Do we already have a profile linked to this Stripe customer?
  {
    const { data, error } = await sb
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", stripe_customer_id)
      .maybeSingle();

    if (error) throw new Error(`profiles lookup failed: ${error.message}`);
    if (data?.id) return data.id as string;
  }

  // 2) Try by email (fetch from Stripe, then update the profile row)
  const cust = (await stripe.customers.retrieve(
    stripe_customer_id
  )) as Stripe.Customer;
  const email = cust.email?.toLowerCase() ?? null;

  if (email) {
    const { data, error } = await sb
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (error) throw new Error(`profiles email lookup failed: ${error.message}`);

    if (data?.id) {
      const { error: updErr } = await sb
        .from("profiles")
        .update({ stripe_customer_id })
        .eq("id", data.id);
      if (updErr) throw new Error(`profiles update failed: ${updErr.message}`);
      return data.id as string;
    }
  }

  // 3) No profile yet (e.g., they haven't signed up in the app). Return null.
  return null;
}

async function upsertSubscriptionRecord(args: {
  stripe: Stripe;
  sub: Stripe.Subscription;
}) {
  const { stripe, sub } = args;
  const sb = createSupabaseAdmin();

  const extracted = extractFromSubscription(sub);

  // Find the owning user (needed because user_id is NOT NULL)
  const userId = await resolveUserIdForCustomer({
    stripe_customer_id: extracted.stripe_customer_id,
    stripe,
  });

  if (!userId) {
    // We can't insert a new row without user_id; try to update an existing row,
    // otherwise just skip (we'll catch up once the user signs in and we can link).
    const { error: updErr } = await sb
      .from("subscriptions")
      .update({
        status: extracted.status,
        price_id: extracted.price_id,
        quantity: extracted.quantity,
        current_period_start: toISO(extracted.current_period_start),
        current_period_end: toISO(extracted.current_period_end),
        cancel_at_period_end: extracted.cancel_at_period_end ?? false,
        updated: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", extracted.stripe_subscription_id);

    if (updErr && updErr.code !== "PGRST116") {
      // PGRST116 = no rows found to update — safe to ignore here
      throw new Error(`Supabase update failed: ${updErr.message}`);
    }
    return;
  }

  const row = {
    user_id: userId,
    stripe_customer_id: extracted.stripe_customer_id,
    stripe_subscription_id: extracted.stripe_subscription_id,
    status: extracted.status,
    price_id: extracted.price_id,
    quantity: extracted.quantity,
    current_period_start: toISO(extracted.current_period_start),
    current_period_end: toISO(extracted.current_period_end),
    cancel_at_period_end: extracted.cancel_at_period_end ?? false,
    updated: new Date().toISOString(),
  };

  // Your schema uses stripe_subscription_id as the unique key.
  const { error } = await sb
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" });

  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

/* ---------- webhook handler ---------- */

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // use account-pinned API version
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

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
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        // 1) Persist sub
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            String(session.subscription)
          );
          await upsertSubscriptionRecord({ stripe, sub });
        }

        // 2) Invite the customer if we have an email
        if (session.customer_details?.email) {
          await sendMagicLinkInvite(session.customer_details.email);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionRecord({ stripe, sub });
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed":
        // Optional: mirror invoice state if you keep an invoices table.
        break;

      default:
        // ignore other events
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

// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return; // soft-skip in preview/CI

  const RESEND_FROM =
    opts.from ?? process.env.RESEND_FROM ?? "Moral Clarity AI <noreply@moralclarity.ai>";

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
  // If Resend is flaky, we don’t want Stripe to retry the entire webhook:
  if (!r.ok) console.warn("Resend failed", r.status, await r.text().catch(() => ""));
}

/* ---------- magic link invite (Supabase) ---------- */

async function sendMagicLinkInvite(email: string) {
  const sb = createSupabaseAdmin();
  const appBase = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://moralclarity.ai";
  const redirectUrl = `${appBase}/auth/callback?next=%2Fapp`;

  const { data, error } = await sb.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: redirectUrl },
  });
  if (error) throw error;

  const props = (data?.properties ?? {}) as Record<string, unknown>;
  const link =
    (props.action_link as string | undefined) ??
    (props.email_otp_link as string | undefined) ??
    (props.magic_link as string | undefined) ??
    (props.invite_link as string | undefined);

  if (!link) throw new Error("Could not generate magic link URL");

  await sendResendEmail({
    to: [email.toLowerCase()],
    subject: "Welcome to Moral Clarity AI — Your Sign-In Link",
    html: `
      <p>Welcome! Click the button below to sign in:</p>
      <p>
        <a href="${link}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#2563eb;color:#fff;text-decoration:none;">
          Sign in
        </a>
      </p>
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

  // 1) profiles.stripe_customer_id
  {
    const { data, error } = await sb
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", stripe_customer_id)
      .maybeSingle();
    if (error) throw new Error(`profiles lookup failed: ${error.message}`);
    if (data?.id) return data.id as string;
  }

  // 2) by email from Stripe, then link
  const cust = (await stripe.customers.retrieve(stripe_customer_id)) as Stripe.Customer;
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

  return null; // purchased before app signup
}

async function upsertSubscriptionRecord(args: { stripe: Stripe; sub: Stripe.Subscription }) {
  const { stripe, sub } = args;
  const sb = createSupabaseAdmin();
  const extracted = extractFromSubscription(sub);

  const userId = await resolveUserIdForCustomer({
    stripe_customer_id: extracted.stripe_customer_id,
    stripe,
  });

  if (!userId) {
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

  const { error } = await sb
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

/* ---------- webhook handler ---------- */

export async function POST(req: Request) {
  // Soft guard so preview/CI doesn’t fail
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  // Use exact raw body for verification
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    return NextResponse.json(
      { error: `Signature verification failed: ${e.message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(String(session.subscription));
          await upsertSubscriptionRecord({ stripe, sub });
        }
        if (session.customer_details?.email) {
          // fire-and-forget so Stripe isn’t blocked on email
          sendMagicLinkInvite(session.customer_details.email).catch((e) =>
            console.warn("magiclink failed:", e?.message || e),
          );
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
        break;

      default:
        break;
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error:", err);
    // Return 200 unless you *want* Stripe to retry
    return NextResponse.json({ ok: true, note: "handled with warnings" }, { status: 200 });
  }
}

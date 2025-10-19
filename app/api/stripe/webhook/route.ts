import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Helpers */
const toISO = (secs?: number | null) =>
  secs ? new Date(secs * 1000).toISOString() : null;

type SubWithPeriods = Stripe.Subscription & {
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
};

type UpsertSub = {
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

/** Persist/refresh a subscription row in Supabase (subscriptions.id = Stripe sub id) */
async function upsertSubscription(params: UpsertSub) {
  const sb = createSupabaseAdmin();

  const row = {
    id: params.id,
    user_id: params.user_id ?? null, // assumes subscriptions.user_id is nullable
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

/** Ensure a profile exists and is linked to the Stripe customer; return user_id (uuid) or null */
async function findOrCreateProfileByStripeCustomer(opts: {
  customerId: string;
  email?: string | null;
}) {
  const sb = createSupabaseAdmin();

  // 1) Try by stripe_customer_id
  const byCust = await sb
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", opts.customerId)
    .limit(1)
    .maybeSingle();

  if (!byCust.error && byCust.data?.id) {
    return byCust.data.id as string;
  }

  // 2) If we have an email, try by email; if found, link customer id
  const email = opts.email?.toLowerCase().trim();
  if (email) {
    const byEmail = await sb
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (!byEmail.error && byEmail.data?.id) {
      if (!byEmail.data.stripe_customer_id) {
        await sb
          .from("profiles")
          .update({ stripe_customer_id: opts.customerId, updated_at: new Date().toISOString() })
          .eq("id", byEmail.data.id);
      }
      return byEmail.data.id as string;
    }

    // 3) No profile exists → create auth user + profile
    const created = await sb.auth.admin.createUser({
      email,
      email_confirm: true, // they’ll still receive a magic link below
    });
    if (created.error) throw created.error;
    const userId = created.data.user?.id;
    if (!userId) return null;

    const ins = await sb.from("profiles").upsert(
      {
        id: userId,
        email,
        stripe_customer_id: opts.customerId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (ins.error) throw ins.error;

    return userId;
  }

  // No email available — return null (we'll upsert sub without user_id for now)
  return null;
}

/** Generate a Supabase magic link to /app for the given email */
async function generateMagicLink(email: string) {
  const sb = createSupabaseAdmin();
  const redirectTo = `${process.env.APP_BASE_URL ?? "https://moralclarity.ai"}/app`;

  const { data, error } = await sb.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  } as any);
  if (error) throw error;

  const link = (data as any)?.properties?.action_link ?? (data as any)?.action_link;
  if (!link) throw new Error("Supabase did not return a magic link");
  return link;
}

/** Send email via Resend REST (no SDK dependency) */
async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY!}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM!,
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend failed: ${res.status} ${text}`);
  }
}

/** Idempotent invite: only send at most once/hour per profile */
async function inviteIfNeeded(opts: {
  email?: string | null;
  customerId: string;
  planLabel?: string;
}) {
  if (!opts.email) return;

  const sb = createSupabaseAdmin();

  // Ensure profile exists/linked
  const userId = await findOrCreateProfileByStripeCustomer({
    customerId: opts.customerId,
    email: opts.email,
  });

  if (!userId) return;

  // Check throttle window (1h)
  const prof = await sb
    .from("profiles")
    .select("invited_at,last_login_link_sent_at")
    .eq("id", userId)
    .maybeSingle();

  if (prof.error) throw prof.error;

  const last = prof.data?.last_login_link_sent_at
    ? new Date(prof.data.last_login_link_sent_at).getTime()
    : 0;
  if (Date.now() - last < 60 * 60 * 1000) return; // skip re-sending

  const magic = await generateMagicLink(opts.email);

  await sendEmail(
    opts.email,
    "Your Moral Clarity AI account is ready",
    `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
        <p>Welcome to <strong>Moral Clarity AI</strong>${
          opts.planLabel ? ` — ${opts.planLabel}` : ""
        }.</p>
        <p>Click the button below to sign in instantly:</p>
        <p><a href="${magic}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#5c7cfa;color:#fff;text-decoration:none;">Sign in</a></p>
        <p>If the button doesn’t work, copy & paste this link:<br>${magic}</p>
      </div>
    `
  );

  await sb
    .from("profiles")
    .update({
      invited_at: prof.data?.invited_at ?? new Date().toISOString(),
      last_login_link_sent_at: new Date().toISOString(),
    })
    .eq("id", userId);
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
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

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
        if (session.mode !== "subscription" || !session.subscription) break;

        const sub = await stripe.subscriptions.retrieve(String(session.subscription));
        const minimal = extractFromSubscription(sub);

        // Email for invite (prefer customer record if present)
        let email =
          session.customer_details?.email ?? session.customer_email ?? undefined;
        if (!email && minimal.customer_id) {
          const cust = (await stripe.customers.retrieve(
            minimal.customer_id
          )) as Stripe.Customer;
          email = cust.email ?? undefined;
        }

        // Resolve user and upsert sub
        const userId = await findOrCreateProfileByStripeCustomer({
          customerId: minimal.customer_id,
          email,
        });
        await upsertSubscription({ ...minimal, user_id: userId ?? null });

        // Send login link (idempotent)
        await inviteIfNeeded({
          email,
          customerId: minimal.customer_id,
          planLabel:
            sub.items?.data?.[0]?.price?.nickname ??
            sub.items?.data?.[0]?.plan?.nickname ??
            undefined,
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const minimal = extractFromSubscription(sub);

        // Best-effort user resolution (email may not be on this event)
        let email: string | undefined = undefined;
        try {
          const cust = (await stripe.customers.retrieve(
            minimal.customer_id
          )) as Stripe.Customer;
          email = cust.email ?? undefined;
        } catch {}

        const userId = await findOrCreateProfileByStripeCustomer({
          customerId: minimal.customer_id,
          email,
        });
        await upsertSubscription({ ...minimal, user_id: userId ?? null });

        // Optional: also invite here as a fallback
        await inviteIfNeeded({
          email,
          customerId: minimal.customer_id,
          planLabel:
            sub.items?.data?.[0]?.price?.nickname ??
            sub.items?.data?.[0]?.plan?.nickname ??
            undefined,
        });

        break;
      }

      // Mirror invoice states if you want
      case "invoice.paid":
      case "invoice.payment_failed":
        break;

      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] error:", err);
    return NextResponse.json({ error: err?.message ?? "Unhandled error" }, { status: 500 });
  }
}

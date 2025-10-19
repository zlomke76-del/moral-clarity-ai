// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Utils */
const toISO = (secs?: number | null) => (secs ? new Date(secs * 1000).toISOString() : null);

type SubWithPeriods = Stripe.Subscription & {
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
};

/** -----------------------------
 *  Email (Resend, via fetch API)
 *  -----------------------------
 *  Avoids SDK friction — uses fetch directly.
 *  ENV:
 *    - RESEND_API_KEY
 *    - RESEND_FROM           (e.g. 'Moral Clarity AI Support <support@moralclarity.ai>')
 */
async function sendMagicLinkInvite(email: string) {
  const sb = createSupabaseAdmin();

  const { data, error } = await sb.auth.admin.generateLink({
    type: "magiclink",
    email,
    // options: { redirectTo: "https://moralclarity.ai/app" }, // optional
  });
  if (error) throw error;

  // Supabase returns various link fields depending on flow; the types don't declare all of them.
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


  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Resend error: ${res.status} ${res.statusText} ${err}`);
  }
}

/** --------------------------------------------
 *  Supabase helpers (admin client is server-side)
 *  --------------------------------------------
 *  Tables assumed:
 *    - public.profiles: { id uuid PK, email text?, display_name?, stripe_customer_id text? ... }
 *    - public.subscriptions:
 *        user_id uuid NOT NULL
 *        stripe_customer_id text NOT NULL
 *        stripe_subscription_id text UNIQUE NOT NULL
 *        status text
 *        price_id text null
 *        quantity int null
 *        current_period_start timestamptz null
 *        current_period_end   timestamptz null
 *        cancel_at_period_end boolean default false
 *        updated timestamptz
 */

/** Upsert/refresh subscription row (no 'id' col, conflict on stripe_subscription_id) */
async function upsertSubscription(params: {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: string;
  price_id?: string | null;
  quantity?: number | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
}) {
  const sb = createSupabaseAdmin();

  const row = {
    user_id: params.user_id,
    stripe_customer_id: params.stripe_customer_id,
    stripe_subscription_id: params.stripe_subscription_id,
    status: params.status,
    price_id: params.price_id ?? null,
    quantity: params.quantity ?? null,
    current_period_start: toISO(params.current_period_start),
    current_period_end: toISO(params.current_period_end),
    cancel_at_period_end: params.cancel_at_period_end ?? false,
    updated: new Date().toISOString(),
  };

  const { error } = await sb.from("subscriptions").upsert(row, {
    onConflict: "stripe_subscription_id",
  });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

/** Try to find a profile by stripe_customer_id, otherwise create a minimal shell profile. */
async function getOrCreateUserIdByCustomerId(args: {
  stripe_customer_id: string;
  fallbackEmail?: string | null;
  fallbackName?: string | null;
}) {
  const { stripe_customer_id, fallbackEmail, fallbackName } = args;
  const sb = createSupabaseAdmin();

  // 1) Try existing profile
  const { data: prof, error: pErr } = await sb
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", stripe_customer_id)
    .maybeSingle();

  if (pErr) throw pErr;
  if (prof?.id) return { user_id: prof.id, created: false };

  // 2) Create a shell profile (attach stripe_customer_id; store email/display_name if we have them)
  const insert = {
    email: fallbackEmail ?? null,
    display_name: fallbackName ?? null,
    stripe_customer_id,
  };

  const { data: created, error: iErr } = await sb
    .from("profiles")
    .insert(insert)
    .select("id")
    .single();

  if (iErr) throw iErr;
  return { user_id: created.id, created: true };
}

/** Optional: generate a Supabase magic link and send it via Resend */
async function sendMagicLinkInvite(email: string) {
  const sb = createSupabaseAdmin();

  // Generate a one-time magic link
  const { data, error } = await sb.auth.admin.generateLink({
    type: "magiclink",
    email,
    // (Optional) If you use a separate redirect, add 'options: { redirectTo: "https://moralclarity.ai/app" }'
  });
  if (error) throw error;

  const link = data?.properties?.action_link || data?.properties?.email_otp_link;
  if (!link) throw new Error("Could not generate magic link URL");

  // Send invite email
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

/** Extract Stripe subscription details in our shape */
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

/** Optionally mirror some invoice state (not required) */
async function handleInvoiceEvent(_inv: Stripe.Invoice) {
  // If you want to persist invoice info, do it here.
  // Leaving empty as optional.
}

/** ----------------------
 *  Webhook entrypoint
 *  ----------------------
 */
export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // uses your Stripe account’s pinned API version
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Get the raw body for signature verification
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET!);
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

        if (session.mode === "subscription" && session.subscription) {
          // 1) Persist subscription
          const sub = await stripe.subscriptions.retrieve(String(session.subscription));
          const base = extractFromSubscription(sub);

          // 2) Resolve (or create) user_id
          // Get richer fallback info from Stripe Customer to help with profile + invite
          const customer = await stripe.customers.retrieve(String(session.customer));
          const fallbackEmail =
            typeof customer?.email === "string" ? customer.email : (session.customer_details?.email ?? null);
          const fallbackName =
            typeof customer?.name === "string" ? customer.name : (session.customer_details?.name ?? null);

          const { user_id, created } = await getOrCreateUserIdByCustomerId({
            stripe_customer_id: base.stripe_customer_id,
            fallbackEmail,
            fallbackName,
          });

          await upsertSubscription({ ...base, user_id });

          // 3) Optional: first-time invite (only if we just created a shell profile & have an email)
          if (created && fallbackEmail) {
            try {
              await sendMagicLinkInvite(fallbackEmail);
            } catch (inviteErr) {
              // Don't fail the webhook for email issues — just log
              console.error("[invite-email] error:", inviteErr);
            }
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const base = extractFromSubscription(sub);

        // We may not have email/name inside this event — fetch customer to enrich if needed
        const customer = await stripe.customers.retrieve(String(sub.customer));
        const fallbackEmail = typeof customer?.email === "string" ? customer.email : null;
        const fallbackName = typeof customer?.name === "string" ? customer.name : null;

        const { user_id } = await getOrCreateUserIdByCustomerId({
          stripe_customer_id: base.stripe_customer_id,
          fallbackEmail,
          fallbackName,
        });

        await upsertSubscription({ ...base, user_id });
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        await handleInvoiceEvent(inv); // optional
        break;
      }

      default:
        // ignore other events
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json({ error: err?.message ?? "Unhandled error" }, { status: 500 });
  }
}

// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

// --- NEW: helpers for user + magic link + email -----------------------------

async function ensureUserAndProfile(opts: {
  email: string;
  stripeCustomerId: string;
}) {
  const sb = createSupabaseAdmin();

  // 1) Ensure Auth user exists
  // Try to find existing user by email; if missing, create confirmed user
  const { data: userByEmail } = await sb.auth.admin.listUsers({
    page: 1,
    perPage: 1,
    filter: { email: opts.email },
  } as any); // listUsers filter is still evolving; okay to ignore types here

  let userId: string | null = null;
  if (userByEmail?.users?.[0]) {
    userId = userByEmail.users[0].id;
  } else {
    const created = await sb.auth.admin.createUser({
      email: opts.email,
      email_confirm: true, // we’ll still send a magic link for easy 1-click sign-in
    });
    if (created.error) throw created.error;
    userId = created.data.user?.id ?? null;
  }
  if (!userId) throw new Error("Failed to ensure Supabase user");

  // 2) Ensure profile row
  const { error: upErr } = await sb
    .from("profiles")
    .upsert(
      {
        id: userId,
        email: opts.email,
        stripe_customer_id: opts.stripeCustomerId,
        updated: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  if (upErr) throw upErr;

  return userId;
}

async function generateMagicLink(opts: {
  email: string;
  redirectTo: string; // e.g., https://moralclarity.ai/app
}) {
  const sb = createSupabaseAdmin();

  const { data, error } = await sb.auth.admin.generateLink({
    type: "magiclink",
    email: opts.email,
    options: { redirectTo: opts.redirectTo },
  } as any);
  if (error) throw error;

  // Supabase returns an `action_link` we can send directly
  const link = (data as any)?.properties?.action_link ?? (data as any)?.action_link;
  if (!link) throw new Error("No magic link returned from Supabase");
  return link;
}

async function sendLoginEmail(opts: {
  to: string;
  link: string;
  planLabel?: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY!}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM!,
      to: [opts.to],
      subject: "Your Moral Clarity AI account is ready",
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
          <p>Welcome to <strong>Moral Clarity AI</strong>${opts.planLabel ? ` — ${opts.planLabel}` : ""}.</p>
          <p>Click the button below to sign in instantly:</p>
          <p><a href="${opts.link}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#5c7cfa;color:#fff;text-decoration:none;">Sign in</a></p>
          <p>If the button doesn’t work, copy & paste this link:<br>${opts.link}</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend failed: ${res.status} ${text}`);
  }
}

async function inviteIfFirstTime(opts: {
  email: string;
  stripeCustomerId: string;
  planLabel?: string;
}) {
  const sb = createSupabaseAdmin();

  const userId = await ensureUserAndProfile({
    email: opts.email,
    stripeCustomerId: opts.stripeCustomerId,
  });

  // Idempotency: if invited within last 1h, skip
  const { data: prof, error } = await sb
    .from("profiles")
    .select("invited_at,last_login_link_sent_at")
    .eq("id", userId)
    .single();
  if (error) throw error;

  const last = prof?.last_login_link_sent_at
    ? new Date(prof.last_login_link_sent_at).getTime()
    : 0;
  const fresh = Date.now() - last < 60 * 60 * 1000;
  if (fresh) return; // already sent recently

  const link = await generateMagicLink({
    email: opts.email,
    redirectTo: `${process.env.APP_BASE_URL ?? "https://moralclarity.ai"}/app`,
  });

  await sendLoginEmail({ to: opts.email, link, planLabel: opts.planLabel });

  await sb
    .from("profiles")
    .update({
      invited_at: prof?.invited_at ?? new Date().toISOString(),
      last_login_link_sent_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

// --- in your POST handler, after you upsert the subscription ----------------

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e: any) {
    return NextResponse.json({ error: `Signature verification failed: ${e.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription && session.customer) {
          // 1) Persist sub (your existing function)
          const sub = await stripe.subscriptions.retrieve(String(session.subscription));
          await upsertSubscription(extractFromSubscription(sub));

          // 2) Invite the customer (only once)
          const customer = await stripe.customers.retrieve(String(session.customer));
          const email = (customer as any)?.email ?? session.customer_details?.email;
          if (email) {
            await inviteIfFirstTime({
              email,
              stripeCustomerId: String(session.customer),
              planLabel: sub.items?.data?.[0]?.price?.nickname ?? undefined,
            });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(extractFromSubscription(sub));

        // Optional: also invite here if for some reason checkout.session.completed didn’t fire
        const customer = await stripe.customers.retrieve(String(sub.customer));
        const email = (customer as any)?.email;
        if (email) {
          await inviteIfFirstTime({
            email,
            stripeCustomerId: String(sub.customer),
            planLabel: sub.items?.data?.[0]?.price?.nickname ?? undefined,
          });
        }
        break;
      }

      // … your other cases (invoice.*, customer.subscription.deleted, etc.)
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[stripe-webhook] error:", err);
    return NextResponse.json({ error: err.message ?? "Unhandled error" }, { status: 500 });
  }
}

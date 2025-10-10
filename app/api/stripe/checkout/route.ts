// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseFromCookies() {
  const cookieStore = cookies();
  const get = (name: string) => cookieStore.get(name)?.value;

  // No-ops for set/remove to satisfy types in API routes
  const set = () => {};
  const remove = () => {};

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get, set, remove } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const {
      priceId,
      successUrl,
      cancelUrl,
    }: { priceId: string; successUrl: string; cancelUrl: string } = await req.json();

    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing priceId, successUrl, or cancelUrl" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseFromCookies();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional: look up an existing Stripe customer for this user
    const { data: link } = await supabase
      .from("user_stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: link?.stripe_customer_id ?? undefined,
      customer_email: link?.stripe_customer_id ? undefined : user.email ?? undefined,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: { user_id: user.id }, // critical: used by webhook to link
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("[stripe:checkout] error", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Checkout failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

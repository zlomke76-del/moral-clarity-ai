// app/api/stripe/portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseFromCookies() {
  const cookieStore = cookies();
  const get = (name: string) => cookieStore.get(name)?.value;
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
    const { returnUrl }: { returnUrl: string } = await req.json();
    if (!returnUrl) {
      return NextResponse.json({ error: "Missing returnUrl" }, { status: 400 });
    }

    const supabase = getSupabaseFromCookies();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: link, error } = await supabase
      .from("user_stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!link?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer on file for this user." },
        { status: 400 }
      );
    }

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
    }
    const stripe = new Stripe(key);

    const session = await stripe.billingPortal.sessions.create({
      customer: link.stripe_customer_id,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[stripe:portal] error", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Portal creation failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

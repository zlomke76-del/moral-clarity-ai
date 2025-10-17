// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";            // ensure Node runtime
export const dynamic = "force-dynamic";     // don't statically analyze this route

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// --- Memory add-on linkage ---
const MEMORY_PRICE_ID = "price_XXXXXXXX_mem1"; // <-- replace with your real $5 1GB price ID
const MEMORY_GB_PER_UNIT = 1;

// Create Supabase admin client lazily at runtime
function getSupabase() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  // Optional: keep it stateless
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function setAddonMemoryFromSubscription(userId: string, sub: Stripe.Subscription) {
  const supabase = getSupabase();
  const items = sub.items?.data ?? [];
  const memoryItem = items.find((it) => it.price?.id === MEMORY_PRICE_ID);
  const units = Math.max(memoryItem?.quantity ?? 0, 0);

  await supabase.rpc("set_memory_addon_quota", {
    p_user_id: userId,
    p_units: units,
    p_gb_per_unit: MEMORY_GB_PER_UNIT,
  });
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text(); // raw string for signature verify

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verify failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.mode !== "subscription") break;

        const supabase = getSupabase();

        const userId = s.metadata?.userId!;
        const tier = s.metadata?.tier || "plus";
        const seats = Number(s.metadata?.seats || "1");
        const memoryGB = Number(s.metadata?.memoryGB || "0");
        const subscriptionId = s.subscription as string;
        const customerId = s.customer as string;

        await supabase
          .from("users")
          .update({
            subscription_active: true,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_tier: tier,
            seats,
          })
          .eq("id", userId);

        if (memoryGB > 0) {
          await supabase.rpc("increment_memory_quota", {
            p_user_id: userId,
            p_delta_gb: memoryGB,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const supabase = getSupabase();
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const isActive = sub.status === "active" || sub.status === "trialing";
        const periodEndUnix = (sub as any)?.current_period_end as number | undefined;
        const periodEndISO = periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null;

        // find internal user id
        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (users && users.length === 1) {
          const userId = users[0].id as string;

          // Reconcile memory add-on idempotently from subscription items
          await setAddonMemoryFromSubscription(userId, sub);

          const update: Record<string, any> = {
            subscription_active: isActive,
            stripe_subscription_status: sub.status,
          };
          if (periodEndISO) update.current_period_end = periodEndISO;

          await supabase.from("users").update(update).eq("id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const supabase = getSupabase();
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (users && users.length === 1) {
          const userId = users[0].id as string;

          await supabase.rpc("set_memory_addon_quota", {
            p_user_id: userId,
            p_units: 0,
            p_gb_per_unit: MEMORY_GB_PER_UNIT,
          });

          await supabase
            .from("users")
            .update({
              subscription_active: false,
              stripe_subscription_status: "canceled",
            })
            .eq("id", userId);
        }
        break;
      }

      default:
        // ignore other events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

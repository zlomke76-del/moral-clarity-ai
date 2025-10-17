import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // raw body + Node required

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // server-only
);

// --- Memory add-on linkage ---
const MEMORY_PRICE_ID = "price_XXXXXXXX_mem1"; // ⬅️ your $5 1GB memory add-on price ID
const MEMORY_GB_PER_UNIT = 1;

async function setAddonMemoryFromSubscription(
  userId: string,
  sub: Stripe.Subscription
) {
  const items = sub.items?.data ?? [];
  const memoryItem = items.find((it) => it.price?.id === MEMORY_PRICE_ID);
  const units = Math.max(memoryItem?.quantity ?? 0, 0);

  // Idempotent: sets memory_quota_gb to units * GB_PER_UNIT
  await supabase.rpc("set_memory_addon_quota", {
    p_user_id: userId,
    p_units: units,
    p_gb_per_unit: MEMORY_GB_PER_UNIT,
  });
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text(); // raw string

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verify failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.mode !== "subscription") break;

        const userId = s.metadata?.userId!;
        const tier = s.metadata?.tier || "plus";
        const seats = Number(s.metadata?.seats || "1");
        const memoryGB = Number(s.metadata?.memoryGB || "0");
        const subscriptionId = s.subscription as string;
        const customerId = s.customer as string;

        // Update user → activate & store Stripe IDs
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

        // Optional immediate UX boost for memory add-on
        if (memoryGB > 0) {
          await supabase.rpc("increment_memory_quota", {
            p_user_id: userId,
            p_delta_gb: memoryGB,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const isActive = sub.status === "active" || sub.status === "trialing";
        const periodEndUnix = (sub as any)?.current_period_end as number | undefined;
        const periodEndISO = periodEndUnix
          ? new Date(periodEndUnix * 1000).toISOString()
          : null;

        const customerId = sub.customer as string;

        // Find the user by stripe_customer_id to get internal id
        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (users && users.length === 1) {
          const userId = users[0].id as string;

          // Idempotent reconciliation of the memory add-on from subscription items
          await setAddonMemoryFromSubscription(userId, sub);

          const update: Record<string, any> = {
            subscription_active: isActive,
            stripe_subscription_status: sub.status,
          };
          if (periodEndISO) update.current_period_end = periodEndISO;

          await supabase
            .from("users")
            .update(update)
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (users && users.length === 1) {
          const userId = users[0].id as string;

          // Zero out memory add-on when subscription ends
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
        // no-op for other events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

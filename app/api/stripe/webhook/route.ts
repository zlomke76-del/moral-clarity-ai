// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // required for raw body & Node crypto

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // server-only
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text(); // raw string, not Buffer/arrayBuffer

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
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.userId!;
        const tier = session.metadata?.tier || "plus";
        const seats = Number(session.metadata?.seats || "1");
        const memoryGB = Number(session.metadata?.memoryGB || "0");
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

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
        const sub = event.data.object as Stripe.Subscription;
        const isActive = sub.status === "active" || sub.status === "trialing";

        // `current_period_end` not guaranteed on TS type – read defensively
        const periodEndUnix = (sub as any)?.current_period_end as number | undefined;
        const periodEndISO = periodEndUnix
          ? new Date(periodEndUnix * 1000).toISOString()
          : null;

        const update: Record<string, any> = {
          subscription_active: isActive,
          stripe_subscription_status: sub.status,
        };
        if (periodEndISO) update.current_period_end = periodEndISO;

        await supabase
          .from("users")
          .update(update)
          .eq("stripe_customer_id", sub.customer as string);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("users")
          .update({
            subscription_active: false,
            stripe_subscription_status: "canceled",
          })
          .eq("stripe_customer_id", sub.customer as string);
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

// ❌ Do NOT export `config` in App Router. Remove the old:
// export const config = { api: { bodyParser: false } } as any;

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // server-only
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
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
        // Only handle subscriptions
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.userId!;
        const tier = session.metadata?.tier || "plus";
        const seats = Number(session.metadata?.seats || "1");
        const memoryGB = Number(session.metadata?.memoryGB || "0");

        // Get subscription + customer IDs
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Update your users (or profiles) table
        await supabase
          .from("users")
          .update({
            subscription_active: true,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_tier: tier,
            seats,
            // If you store memory quota separately, add it here:
            memory_gb: supabase.rpc ? undefined : undefined,
          })
          .eq("id", userId);

        // If memory is an add-on product: increment quota
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
        const customerId = sub.customer as string;

        // Map status → active flag
        const isActive = sub.status === "active" || sub.status === "trialing";

        // If you store stripe_customer_id on users, update by that
        await supabase
          .from("users")
          .update({
            subscription_active: isActive,
            stripe_subscription_status: sub.status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        await supabase
          .from("users")
          .update({
            subscription_active: false,
            stripe_subscription_status: "canceled",
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      // optional: handle invoice.paid / payment_failed for UI badges
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

// Disable Next.js body parsing for this route
export const config = { api: { bodyParser: false } } as any;

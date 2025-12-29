import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PLAN_TO_PRICE, PLAN_META, type PlanSlug } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { plan?: string } }
) {
  const url = new URL(req.url);

  // Canonical plan resolution:
  // 1. Route param (/buy/[plan])
  // 2. ?plan=standard
  // 3. ?nxtPlan=standard (observed in staging logs)
  const rawPlan =
    params?.plan ??
    url.searchParams.get("plan") ??
    url.searchParams.get("nxtPlan");

  const plan = rawPlan?.toLowerCase() as PlanSlug | undefined;

  if (!plan || !(plan in PLAN_TO_PRICE)) {
    return NextResponse.json(
      {
        error: "Unknown plan",
        received: {
          routeParam: params?.plan ?? null,
          planQuery: url.searchParams.get("plan"),
          nxtPlanQuery: url.searchParams.get("nxtPlan"),
        },
      },
      { status: 400 }
    );
  }

  const priceId = PLAN_TO_PRICE[plan];
  const meta = PLAN_META[plan];

  // ✅ Let Stripe use the account’s default API version
  // This avoids TS literal mismatches and future build breaks
  const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY as string
  );

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${url.origin}/app/billing/success?plan=${plan}`,
      cancel_url: `${url.origin}/pricing`,
      metadata: {
        plan,
        label: meta.label,
      },
    });

    return NextResponse.redirect(session.url as string, 303);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Stripe session creation failed",
        message: err?.message ?? "Unknown Stripe error",
      },
      { status: 500 }
    );
  }
}

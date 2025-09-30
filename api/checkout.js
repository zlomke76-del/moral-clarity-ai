// api/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Some hosts send req.body as string — handle both
    const raw = req.body ?? {};
    const { priceId, coupon } = typeof raw === "string" ? JSON.parse(raw) : raw;

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    };

    // Optional: pre-apply a promotion code if provided (e.g., FAITH50)
    if (coupon && coupon.trim()) {
      const promos = await stripe.promotionCodes.list({
        code: coupon.trim(),
        active: true,
        limit: 1,
      });
      if (promos.data[0]) {
        params.discounts = [{ promotion_code: promos.data[0].id }];
      }
    }

    const session = await stripe.checkout.sessions.create(params);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

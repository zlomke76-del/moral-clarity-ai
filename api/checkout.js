// api/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId, coupon } = req.body || {};
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });

    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true, // lets users enter promotion codes on checkout
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`
    };

    // If you passed a coupon code (raw coupon ID or promotion code lookup)
    if (coupon && typeof coupon === "string" && coupon.trim()) {
      // Try to find a promotion code by its code string (e.g., FAITH50)
      const promos = await stripe.promotionCodes.list({ code: coupon.trim(), active: true, limit: 1 });
      if (promos.data[0]) {
        params.discounts = [{ promotion_code: promos.data[0].id }];
      }
    }

    const session = await stripe.checkout.sessions.create(params);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

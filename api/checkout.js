// api/checkout.js
import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

// Guard: if Vercel didn't inject the secret, fail fast with a readable message
if (!secret) {
  console.error("Missing STRIPE_SECRET_KEY env var");
}

const stripe = new Stripe(secret, { apiVersion: "2022-11-15" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId, coupon } = req.body || {};
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });
    if (!secret) return res.status(500).json({ error: "Server misconfiguration" });

    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    };

    if (coupon && coupon.trim()) {
      const promos = await stripe.promotionCodes.list({
        code: coupon.trim(),
        active: true,
        limit: 1,
      });
      if (promos.data[0]) params.discounts = [{ promotion_code: promos.data[0].id }];
    }

    const session = await stripe.checkout.sessions.create(params);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

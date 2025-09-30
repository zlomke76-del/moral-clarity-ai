// /api/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { priceId, coupon } = req.body || {};
    if (!priceId) {
      res.status(400).json({ error: "Missing priceId" });
      return;
    }

    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      // Let customers enter promotion codes at checkout:
      allow_promotion_codes: true,
      success_url: "https://www.moralclarityai.com/success",
      cancel_url: "https://www.moralclarityai.com/cancel",
    };

    // If you passed a coupon code (for Ministry Plan), try to pre-apply it.
    if (coupon) {
      // Look up a promotion code by code string (e.g., "FAITH50")
      const promos = await stripe.promotionCodes.list({
        code: coupon,
        active: true,
        limit: 1,
      });
      if (promos.data[0]) {
        params.discounts = [{ promotion_code: promos.data[0].id }];
      }
    }

    const session = await stripe.checkout.sessions.create(params);
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).send(err.message || "Internal error");
  }
}

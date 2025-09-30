import Stripe from "stripe";
pk_live_51SCrCv0tWJXzci1Aykw5idEQRgt3IPU2aN7EWVG1SCB4dibVQgCvFOeiiFxDEhhsqR4CWjrV8IDwbsu3rfx2vObA00YLfcCjjQ
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId, coupon } = req.body || {};

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

    // Handle coupon (if provided)
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

    // Create checkout session
    const session = await stripe.checkout.sessions.create(params);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
}

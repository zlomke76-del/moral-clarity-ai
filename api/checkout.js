// api/checkout.js
export const config = {
  runtime: "nodejs", // 👈 force Node.js runtime (not Edge)
};

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Use a fixed site URL to avoid header issues
const SITE_URL = "https://www.moralclarityai.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Minimal, known-good call. Use your real price ID:
    const priceId = "price_1SCsmG0tWJXzci1AX3GLoTj8"; // $25

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error", {
      message: err?.message,
      type: err?.type,
      code: err?.code,
      param: err?.param,
    });
    return res.status(500).json({ error: err?.message || "Internal server error" });
  }
}

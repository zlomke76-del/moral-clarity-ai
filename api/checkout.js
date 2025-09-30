// api/checkout.js
import Stripe from "stripe";

// Your secret key must start with sk_live_ (or sk_test_ in test mode)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use a fixed site URL so we don't depend on headers
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.moralclarityai.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse body safely whether it's an object or a string
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    if (!body || typeof body !== "object") body = {};

    const { priceId } = body;
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    // Minimal params (no coupons, no extra fields)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    // This is the error we want to see if Stripe is unhappy
    console.error("❌ Stripe error:", err?.message, err);
    return res.status(500).json({ error: err?.message || "Internal server error" });
  }
}

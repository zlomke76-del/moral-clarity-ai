// /api/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }

  // Accept parsed objects or raw JSON strings
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); }
    catch { return res.status(400).json({ error: { message: "Body must be valid JSON" } }); }
  }

  const { priceId, success_url, cancel_url, customer_email } = body || {};
  if (!priceId) {
    return res.status(400).json({ error: { message: "Missing priceId" } });
  }

  try {
    const origin = req.headers.origin || "https://www.moralclarityai.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url || `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${origin}/pricing.html`,
      ...(customer_email ? { customer_email } : {}),
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(400).json({
      error: { message: err?.message || "Unknown error creating checkout session" },
    });
  }
}

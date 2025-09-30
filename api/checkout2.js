// api/checkout2.js — fresh minimal handler
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "https://moral-clarity-ai.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", "https://moral-clarity-ai.vercel.app");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    const priceId = body?.priceId;

    if (!priceId || typeof priceId !== "string") {
      res.setHeader("Access-Control-Allow-Origin", "https://moral-clarity-ai.vercel.app");
      return res.status(400).json({ error: "Missing priceId" });
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://moral-clarity-ai.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/success`,
      cancel_url: `${base}/cancel`,
    });

    res.setHeader("Access-Control-Allow-Origin", "https://moral-clarity-ai.vercel.app");
    return res.status(200).json({ url: session.url });
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "https://moral-clarity-ai.vercel.app");
    return res.status(400).json({ error: String(e?.message || e) });
  }
}

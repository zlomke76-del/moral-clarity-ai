// api/checkout.js — Minimal Stripe Checkout session (subscription)
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// Allow your site + localhost (optional)
const ORIGINS = [
  "https://moral-clarity-ai.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];
const allowOrigin = (req) => (ORIGINS.includes(req.headers.origin) ? req.headers.origin : ORIGINS[0]);

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ---- Strict JSON body (no fancy parsing) ----
    const { priceId } = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    if (!priceId) {
      res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
      return res.status(400).json({ error: "Missing priceId" });
    }

    // ---- MINIMAL PARAMS ONLY (avoid any nested objects that could stringify badly) ----
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moral-clarity-ai.vercel.app";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });

    res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
    return res.status(200).json({ url: session.url });
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
    return res.status(400).json({ error: e?.message || "Checkout error" });
  }
}

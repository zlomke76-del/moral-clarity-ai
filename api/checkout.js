// api/checkout.js  (Vercel Serverless Function for a SPA)
import Stripe from "stripe";

// ---- CORS (allow your site + local dev) ----
const allowOrigin = (req) => {
  const origin = req.headers.origin || "";
  const allowed = [
    "http://localhost:5173",        // Vite dev
    "http://localhost:3000",        // alt dev
    "https://moral-clarity-ai.vercel.app", // your prod
  ];
  return allowed.includes(origin) ? origin : allowed[2];
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  // Preflight
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
    // ---- Robust JSON body parsing (handles object or raw string) ----
    let priceId;
    if (req.body && typeof req.body === "object") {
      priceId = req.body.priceId;
    } else if (typeof req.body === "string") {
      try { priceId = JSON.parse(req.body).priceId; } catch (_) {}
    } else if (req.readable) {
      // fallback: read raw data
      const raw = await new Promise((resolve) => {
        let data = "";
        req.setEncoding("utf8");
        req.on("data", (c) => (data += c));
        req.on("end", () => resolve(data));
      });
      try { priceId = JSON.parse(raw).priceId; } catch (_) {}
    }

    if (!priceId) {
      res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
      return res.status(400).json({ error: "Request body is not valid JSON or missing priceId" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5173"}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5173"}/cancel`,
      automatic_tax: { enabled: true },
    });

    res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
    return res.status(200).json({ url: session.url });
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
    return res.status(400).json({ error: err?.message || "Checkout error" });
  }
}

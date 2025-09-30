// api/checkout.js — Vercel Serverless Function for your SPA
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// Allowed origins for CORS
const ORIGINS = [
  "https://moral-clarity-ai.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

function allowOrigin(req) {
  const o = req.headers.origin || "";
  return ORIGINS.includes(o) ? o : ORIGINS[0];
}

// Read raw body safely across environments (object | string | stream)
async function readJson(req) {
  // If Vercel already parsed JSON:
  if (req.body && typeof req.body === "object") return req.body;

  // If it's a JSON string:
  if (typeof req.body === "string" && req.body.trim().length) {
    return JSON.parse(req.body);
  }

  // Otherwise, read the stream:
  const chunks = [];
  await new Promise((resolve, reject) => {
    req.setEncoding("utf8");
    req.on("data", (c) => chunks.push(c));
    req.on("end", resolve);
    req.on("error", reject);
  });

  const raw = chunks.join("");
  return raw ? JSON.parse(raw) : {};
}

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
    const body = await readJson(req);
    const priceId = body?.priceId;

    if (!priceId || typeof priceId !== "string") {
      res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
      return res.status(400).json({ error: "Missing or invalid priceId" });
    }

    // Minimal, safe params (no nested objects that stringify weirdly)
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://moral-clarity-ai.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });

    res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
    return res.status(200).json({ url: session.url });
  } catch (e) {
    // Make the error simple & actionable
    res.setHeader("Access-Control-Allow-Origin", allowOrigin(req));
    return res.status(400).json({ error: String(e?.message || e) });
  }
}

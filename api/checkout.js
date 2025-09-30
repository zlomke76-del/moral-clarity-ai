// /api/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // or your current
});

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }

  try {
    // Ensure we actually got JSON
    const { priceId, success_url, cancel_url, customer_email } =
      (req.body && typeof req.body === "object" ? req.body : {}) || {};

    if (!priceId) {
      return res.status(400).json({ error: { message: "Missing priceId" } });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        success_url ||
        `${req.headers.origin || "https://www.moralclarityai.com"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancel_url ||
        `${req.headers.origin || "https://www.moralclarityai.com"}/pricing`,
      ...(customer_email ? { customer_email } : {}),
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    const message =
      err && typeof err.message === "string"
        ? err.message
        : String(err || "Unknown error");
    return res.status(400).json({ error: { message } });
  }
}

// Vercel uses Node, so body parsing is automatic for JSON requests.
// If you ever switch runtimes and lose that, use:
// const body = JSON.parse(await new Promise(r=>{ let d=""; req.on("data",c=>d+=c); req.on("end",()=>r(d)); }));

// api/checkout.js
import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

// Build a reusable JSON response helper that never throws HTML
function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!secret) {
    // If your function hits this, env var wasn’t available to the function runtime
    return json(res, 500, { error: "Missing STRIPE_SECRET_KEY on server" });
  }

  const stripe = new Stripe(secret, { apiVersion: "2022-11-15" });

  try {
    const { priceId, coupon } = (req.body && typeof req.body === "object") ? req.body : {};

    if (!priceId || typeof priceId !== "string") {
      return json(res, 400, { error: "Missing or invalid priceId" });
    }

    const origin =
      (req.headers && (req.headers.origin || req.headers.referer)) || "";
    const base = origin.replace(/\/$/, "");

    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cancel`
    };

    // Optional coupon
    if (coupon && typeof coupon === "string" && coupon.trim()) {
      const promos = await stripe.promotionCodes.list({
        code: coupon.trim(),
        active: true,
        limit: 1
      });
      if (promos.data[0]) {
        params.discounts = [{ promotion_code: promos.data[0].id }];
      }
    }

    const session = await stripe.checkout.sessions.create(params);
    return json(res, 200, { url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    // Ensure we always send back JSON, never HTML
    return json(res, 500, {
      error:
        (err && err.message) ||
        "Internal server error (checkout failed)"
    });
  }
}

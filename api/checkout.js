// /api/checkout.js
import Stripe from "stripe";

/**
 * Always reply JSON (never HTML), so the frontend can display real messages.
 */
function sendJson(res, status, obj) {
  res.status(status);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return sendJson(res, 500, { error: "Missing STRIPE_SECRET_KEY on server" });
  }

  // ---- Parse body robustly (Vercel may give string or already-parsed object) ----
  let body = {};
  try {
    if (typeof req.body === "string") {
      body = JSON.parse(req.body || "{}");
    } else if (req.body && typeof req.body === "object") {
      body = req.body;
    } else {
      // Read raw stream just in case (older runtimes)
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const raw = Buffer.concat(chunks).toString("utf8");
      body = raw ? JSON.parse(raw) : {};
    }
  } catch (e) {
    return sendJson(res, 400, { error: "Request body is not valid JSON" });
  }

  const { priceId, coupon } = body;

  if (!priceId || typeof priceId !== "string") {
    return sendJson(res, 400, { error: "Missing or invalid priceId" });
  }

  // Build a safe base URL. Prefer Origin, then Referer, then Host.
  const origin =
    req.headers.origin ||
    (req.headers.referer ? new URL(req.headers.referer).origin : null) ||
    (req.headers.host ? `https://${req.headers.host}` : null);

  if (!origin) {
    return sendJson(res, 500, { error: "Unable to determine site origin" });
  }

  const stripe = new Stripe(secret, { apiVersion: "2022-11-15" });

  try {
    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`
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
    return sendJson(res, 200, { url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    // Normalize Stripe errors to a simple message for the UI
    const message =
      (err && err.message) ||
      (err && err.error && err.error.message) ||
      "Internal server error";
    return sendJson(res, 500, { error: message });
  }
}

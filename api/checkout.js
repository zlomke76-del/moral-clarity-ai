// /api/checkout.js
import Stripe from "stripe";

// tiny helper to send JSON consistently
function sendJson(res, status, obj) {
  res.status(status);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

// read raw request body if a framework didn't parse it
async function readRaw(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8");
}

// support JSON and x-www-form-urlencoded
function parseBody(raw, contentType) {
  if (!raw) return {};
  if (typeof raw === "object") return raw;

  const ct = (contentType || "").toLowerCase();

  // try JSON
  try {
    return JSON.parse(raw);
  } catch (_) {
    // try form-encoded
    if (ct.includes("application/x-www-form-urlencoded") || raw.includes("=")) {
      const params = new URLSearchParams(raw);
      const obj = {};
      for (const [k, v] of params) obj[k] = v;
      return obj;
    }
  }
  return {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return sendJson(res, 500, { error: "Missing STRIPE_SECRET_KEY on server" });

  // best-effort origin
  const origin =
    req.headers.origin ||
    (req.headers.referer ? new URL(req.headers.referer).origin : null) ||
    (req.headers.host ? `https://${req.headers.host}` : null);

  if (!origin) return sendJson(res, 500, { error: "Unable to determine site origin" });

  let body = {};
  try {
    const raw = await readRaw(req);
    body = parseBody(raw, req.headers["content-type"]);
  } catch {
    return sendJson(res, 400, { error: "Unable to read request body" });
  }

  const priceId = typeof body.priceId === "string" ? body.priceId.trim() : "";
  const coupon = typeof body.coupon === "string" ? body.coupon.trim() : "";

  if (!priceId) return sendJson(res, 400, { error: "Missing or invalid priceId" });

  const stripe = new Stripe(secret, { apiVersion: "2022-11-15" });

  try {
    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    };

    if (coupon) {
      try {
        const promos = await stripe.promotionCodes.list({
          code: coupon,
          active: true,
          limit: 1,
        });
        if (promos.data[0]) params.discounts = [{ promotion_code: promos.data[0].id }];
      } catch (e) {
        console.warn("coupon lookup failed:", e?.message || e);
      }
    }

    const session = await stripe.checkout.sessions.create(params);
    return sendJson(res, 200, { url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return sendJson(res, 500, { error: err?.message || "Internal server error" });
  }
}

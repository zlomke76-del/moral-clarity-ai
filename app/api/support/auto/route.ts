// app/api/support/auto/route.ts
import { NextResponse } from "next/server";

const SUPA = process.env.SUPABASE_URL!;
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HDRS = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function sendEmail(to:string, subject:string, text:string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY!}`, "Content-Type":"application/json" },
    body: JSON.stringify({ from: "Moral Clarity Support <support@moralclarity.ai>", to, subject, text }),
  });
  if (!r.ok) console.error("Auto email failed:", await r.text());
}

function pickTemplate(category:string, description:string) {
  const d = description.toLowerCase();

  // examples — extend as you learn:
  if (category === "Billing" && (d.includes("receipt") || d.includes("invoice"))) {
    return {
      subject: "Here’s your receipt",
      text: `We’ve resent your latest receipt(s) to this email. If you need a billing name or VAT updated, reply with the exact details and date. — Steward`,
    };
  }
  if (category === "Account" && (d.includes("change email") || d.includes("new email"))) {
    return {
      subject: "Update your login email",
      text: `We can update your login email. Reply with: 1) old address, 2) new address. We’ll send a confirm link to both. — Steward`,
    };
  }
  if (category === "Technical" && d.includes("can’t login")) {
    return {
      subject: "One-tap sign-in link",
      text: `Use this secure link to sign in. If it expires, request again from the sign-in page. If you still can’t access, reply and we’ll issue a manual session. — Steward`,
    };
  }
  // unknown → let human handle
  return null;
}

export async function POST(req: Request) {
  // 1) Verify webhook secret (set SUPA_WEBHOOK_SECRET in Vercel + Supabase)
  const auth = req.headers.get("x-webhook-key");
  if (auth !== process.env.SUPA_WEBHOOK_SECRET) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json(); // Supabase payload
  const row = body?.record;
  if (!row) return NextResponse.json({ ok: true }); // nothing

  const { id, email, name, category, description } = row;
  const tpl = pickTemplate(category, description || "");

  if (!tpl) {
    // mark for human triage
    await fetch(`${SUPA}/rest/v1/support_requests?id=eq.${id}`, {
      method: "PATCH", headers: HDRS, body: JSON.stringify({ status: "in_progress", needs_human: true })
    });
    return NextResponse.json({ ok: true, action: "escalated" });
  }

  // 2) send reply
  await sendEmail(email, tpl.subject, `Hi ${name || "there"},\n\n${tpl.text}\n`);

  // 3) store reply + resolve
  await fetch(`${SUPA}/rest/v1/support_replies`, {
    method: "POST",
    headers: HDRS,
    body: JSON.stringify({ request_id: id, author: "admin", body: `(auto) ${tpl.subject}\n\n${tpl.text}` }),
  });
  await fetch(`${SUPA}/rest/v1/support_requests?id=eq.${id}`, {
    method: "PATCH", headers: HDRS, body: JSON.stringify({ status: "resolved", auto_resolved: true })
  });

  return NextResponse.json({ ok: true, action: "resolved" });
}

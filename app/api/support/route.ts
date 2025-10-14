// app/api/support/route.ts
import { NextResponse } from "next/server";

// --- helpers ---------------------------------------------------
async function insertSupport(payload: any) {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { name, email, category, description, attachment_url } = payload;

  const res = await fetch(`${url}/rest/v1/support_requests`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name: name || null,
      email,
      category,
      description,
      attachment_url: attachment_url || null,
    }),
    // Important on Vercel edge/node runtimes
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`DB error: ${await res.text()}`);
  const [row] = await res.json();
  return row; // { id, ... }
}

function validate(body: any) {
  const required = ["email", "category", "description"];
  for (const k of required) {
    if (!body?.[k] || String(body[k]).trim() === "") {
      throw new Error(`Missing field: ${k}`);
    }
  }
  const categories = ["Billing", "Technical", "Account", "Suggestion", "Ethical Concern"];
  if (!categories.includes(body.category)) throw new Error("Invalid category.");
}

async function sendResendEmail({
  to,
  subject,
  text,
  from,
}: {
  to: string;
  subject: string;
  text: string;
  from: string;
}) {
  const apiKey = process.env.RESEND_API_KEY!;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  // Don't throw on non-200; just log — we still want ticket creation to succeed
  if (!r.ok) console.error("Resend email failed:", await r.text());
}

// --- handler ---------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    validate(body);

    const row = await insertSupport(body);

    const supportTo = process.env.SUPPORT_INBOX || "support@moralclarity.ai";
    const appUrl = process.env.APP_BASE_URL || "https://moralclarity.ai";

    // Use your verified sender; until DNS verifies, you can use onboarding@resend.dev
    const FROM = "Moral Clarity Support <support@moralclarity.ai>";
    // const FROM = "Moral Clarity Support <onboarding@resend.dev>";

    // 1) auto-reply to user
    await sendResendEmail({
      from: FROM,
      to: body.email,
      subject: "We’ve received your question",
      text: `Hi ${body.name || "there"},

Thanks for reaching out. We’ve received your question and a Steward will respond thoughtfully.

Ticket ID: ${row.id.slice(0, 8)}
Category: ${body.category}

You can reply to this email with more context or a screenshot.

— Moral Clarity Support
`,
    });

    // 2) internal notification
    await sendResendEmail({
      from: FROM,
      to: supportTo,
      subject: `New support request — ${body.category}`,
      text: `User: ${body.name || "(no name)"} <${body.email}>
Category: ${body.category}
Submitted: ${new Date().toISOString()}

Message:
${body.description}

Attachment: ${body.attachment_url || "(none)"}

Open dashboard: ${appUrl}/support/admin (placeholder)
`,
    });

    return NextResponse.json({ ok: true, id: row.id });
  } catch (err: any) {
    return new NextResponse(err.message || "Bad Request", { status: 400 });
  }
}

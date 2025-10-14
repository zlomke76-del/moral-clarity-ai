// app/api/support/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Minimal Supabase insert using service role
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
  const categories = ["Billing","Technical","Account","Suggestion","Ethical Concern"];
  if (!categories.includes(body.category)) throw new Error("Invalid category.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    validate(body);

    // naive rate-limit by IP (basic)
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0] || "unknown";

    const row = await insertSupport({ ...body, ip });

    // emails
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const supportTo = process.env.SUPPORT_INBOX || "support@moralclarity.ai";
    const appUrl = process.env.APP_BASE_URL || "https://moralclarity.ai";

    // 1) user auto-reply
    await resend.emails.send({
      from: "Moral Clarity Support <support@moralclarity.ai>",
      to: body.email,
      subject: "We’ve received your question",
      text:
`Hi ${body.name || "there"},

Thanks for reaching out. We’ve received your question and a Steward will respond thoughtfully.

Ticket ID: ${row.id.slice(0,8)}
Category: ${body.category}

You can reply to this email with more context or a screenshot.

— Moral Clarity Support
`,
    });

    // 2) internal notification
    await resend.emails.send({
      from: "Moral Clarity Support <support@moralclarity.ai>",
      to: supportTo,
      subject: `New support request — ${body.category}`,
      text:
`User: ${body.name || "(no name)"} <${body.email}>
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

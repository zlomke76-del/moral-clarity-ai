// app/api/support/reply/route.ts
import { NextResponse } from "next/server";

function assertAdmin(req: Request) {
  const hdr = req.headers.get("x-admin-key") || "";
  if (hdr !== process.env.ADMIN_DASH_KEY) throw new Error("Unauthorized");
}

async function sendResendEmail({
  to, subject, text, from,
}: { to: string; subject: string; text: string; from: string; }) {
  const apiKey = process.env.RESEND_API_KEY!;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!r.ok) console.error("Resend error:", await r.text());
}

export async function POST(req: Request) {
  try {
    assertAdmin(req);
    const { requestId, message } = await req.json();
    if (!requestId || !message) throw new Error("Missing requestId or message");

    const supa = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // 1) fetch ticket for email
    const ticketRes = await fetch(`${supa}/rest/v1/support_requests?id=eq.${requestId}&select=email,name,category`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!ticketRes.ok) throw new Error(await ticketRes.text());
    const [ticket] = await ticketRes.json();
    if (!ticket) throw new Error("Ticket not found");

    // 2) insert reply row
    const ins = await fetch(`${supa}/rest/v1/support_replies`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ request_id: requestId, author: "admin", body: message }),
    });
    if (!ins.ok) throw new Error(await ins.text());

    // 3) send email to user
    // TEMP sender until Resend domain fully verified:
    // const FROM = "Moral Clarity Support <onboarding@resend.dev>";
    const FROM = "Moral Clarity Support <support@moralclarity.ai>";
    await sendResendEmail({
      from: FROM,
      to: ticket.email,
      subject: `Re: Your Moral Clarity request (${ticket.category})`,
      text:
`Hi ${ticket.name || "there"},

${message}

If you reply to this email, we’ll see it and continue the thread.

— Moral Clarity Support`,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message || "Bad Request", { status: e.message === "Unauthorized" ? 401 : 400 });
  }
}


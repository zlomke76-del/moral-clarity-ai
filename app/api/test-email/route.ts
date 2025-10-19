// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // Resend SDK needs Node runtime

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,        // e.g. 'Moral Clarity AI Support <support@moralclarity.ai>'
      to: ["zlomke76@gmail.com"],            // test recipient
      subject: "Resend wiring check (MoralClarity.ai)",
      text: "If you received this, Resend + domain + server route are all wired.",
    });

    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}

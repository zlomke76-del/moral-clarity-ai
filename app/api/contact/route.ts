import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Moral Clarity AI <no-reply@moralclarity.ai>",
      to: [process.env.CONTACT_TO_EMAIL!],
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CONTACT_FORM_ERROR", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}

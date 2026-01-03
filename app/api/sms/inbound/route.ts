// ------------------------------------------------------------
// Inbound SMS Webhook (Twilio → Solace)
// Authoritative, Read-Only, Approval-Gated
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// ------------------------------------------------------------
// Helpers — Twilio signature verification
// ------------------------------------------------------------
function verifyTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string | null
): boolean {
  if (!signature) return false;

  const sortedKeys = Object.keys(params).sort();
  const data =
    url +
    sortedKeys.map((k) => `${k}${params[k]}`).join("");

  const expected = crypto
    .createHmac("sha1", process.env.TWILIO_AUTH_TOKEN!)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const url = req.url;
    const bodyText = await req.text();
    const form = Object.fromEntries(new URLSearchParams(bodyText));

    const twilioSignature =
      req.headers.get("x-twilio-signature");

    // --------------------------------------------------------
    // SECURITY — Verify Twilio
    // --------------------------------------------------------
    const verified = verifyTwilioSignature(
      url,
      form as Record<string, string>,
      twilioSignature
    );

    if (!verified) {
      console.error("[SMS INBOUND] invalid signature");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      From,
      To,
      Body,
      MessageSid,
    } = form;

    if (!From || !Body) {
      return NextResponse.json({ ok: true });
    }

    // --------------------------------------------------------
    // Admin client (RLS bypass)
    // --------------------------------------------------------
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // --------------------------------------------------------
    // Resolve sender → Rolodex
    // --------------------------------------------------------
    const { data: contact } = await supabase
      .schema("memory")
      .from("rolodex")
      .select("*")
      .eq("primary_phone", From)
      .single();

    // --------------------------------------------------------
    // Write inbound interaction (NON-AUTOMATED)
    // --------------------------------------------------------
    await supabase
      .schema("memory")
      .from("working_memory")
      .insert({
        role: "system",
        content: JSON.stringify({
          type: "sms_inbound",
          from: From,
          to: To,
          body: Body,
          message_sid: MessageSid,
          contact: contact
            ? {
                id: contact.id,
                name: contact.name,
              }
            : null,
        }),
      });

    console.log("[SMS INBOUND]", {
      from: From,
      contact: contact?.name ?? "unknown",
      body: Body,
    });

    // --------------------------------------------------------
    // IMPORTANT:
    // No auto-reply. No TwiML. Approval required.
    // --------------------------------------------------------
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[SMS INBOUND ERROR]", err);
    return NextResponse.json({ ok: true });
  }
}

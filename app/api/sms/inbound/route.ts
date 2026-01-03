// ------------------------------------------------------------
// Inbound SMS Webhook (Twilio → Solace)
// Authoritative, Read-Only, Approval-Gated
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// ------------------------------------------------------------
// Runtime config
// ------------------------------------------------------------
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ------------------------------------------------------------
// ENV
// ------------------------------------------------------------
const {
  TWILIO_AUTH_TOKEN,
  TWILIO_WEBHOOK_BASE_URL,
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

if (
  !TWILIO_AUTH_TOKEN ||
  !TWILIO_WEBHOOK_BASE_URL ||
  !NEXT_PUBLIC_SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY
) {
  throw new Error("Inbound SMS env not fully configured");
}

// ------------------------------------------------------------
// Helpers — Twilio signature verification
// ------------------------------------------------------------
function verifyTwilioSignature(
  params: Record<string, string>,
  signature: string | null
): boolean {
  if (!signature) return false;

  const sortedKeys = Object.keys(params).sort();
  const data =
    TWILIO_WEBHOOK_BASE_URL +
    sortedKeys.map((k) => `${k}${params[k]}`).join("");

  const expected = crypto
    .createHmac("sha1", TWILIO_AUTH_TOKEN)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);

  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

// ------------------------------------------------------------
// POST
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const form = Object.fromEntries(new URLSearchParams(bodyText));

    const twilioSignature =
      req.headers.get("x-twilio-signature");

    // --------------------------------------------------------
    // SECURITY — Verify Twilio
    // --------------------------------------------------------
    const verified = verifyTwilioSignature(
      form as Record<string, string>,
      twilioSignature
    );

    if (!verified) {
      console.error("[SMS INBOUND] Invalid signature");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      From,
      To,
      Body,
      MessageSid,
    } = form;

    if (!From || !Body || !MessageSid) {
      return NextResponse.json({ ok: true });
    }

    // --------------------------------------------------------
    // Admin client (RLS bypass)
    // --------------------------------------------------------
    const supabase = createClient(
      NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
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
      .select("id, user_id, name")
      .eq("primary_phone", From)
      .maybeSingle();

    // --------------------------------------------------------
    // Write inbound message (DURABLE)
    // --------------------------------------------------------
    await supabase
      .schema("memory")
      .from("inbound_messages")
      .insert({
        user_id: contact?.user_id ?? null,
        rolodex_id: contact?.id ?? null,
        channel: "sms",
        from: From,
        to: To,
        body: Body,
        provider: "twilio",
        provider_sid: MessageSid,
      });

    console.log("[SMS INBOUND]", {
      from: From,
      contact: contact?.name ?? "unknown",
      body: Body,
    });

    // --------------------------------------------------------
    // IMPORTANT:
    // - No auto-reply
    // - No TwiML
    // - Solace must ask for approval
    // --------------------------------------------------------
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[SMS INBOUND ERROR]", err);
    return NextResponse.json({ ok: true });
  }
}

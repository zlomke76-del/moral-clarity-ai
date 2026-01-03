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
// ENV VALIDATION (FAIL FAST)
// ------------------------------------------------------------
const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  TWILIO_AUTH_TOKEN,
} = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
}

if (!TWILIO_AUTH_TOKEN) {
  throw new Error("TWILIO_AUTH_TOKEN is not configured");
}

// Narrowed, non-optional constants (TS-safe)
const SUPABASE_URL = NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = SUPABASE_SERVICE_ROLE_KEY;
const TWILIO_TOKEN = TWILIO_AUTH_TOKEN;

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
    sortedKeys.map((key) => `${key}${params[key]}`).join("");

  const expected = crypto
    .createHmac("sha1", TWILIO_TOKEN)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signature);

  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const url = req.url;
    const bodyText = await req.text();
    const form = Object.fromEntries(
      new URLSearchParams(bodyText)
    ) as Record<string, string>;

    const twilioSignature =
      req.headers.get("x-twilio-signature");

    // --------------------------------------------------------
    // SECURITY — Verify Twilio signature
    // --------------------------------------------------------
    const verified = verifyTwilioSignature(
      url,
      form,
      twilioSignature
    );

    if (!verified) {
      console.error("[SMS INBOUND] Invalid Twilio signature");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { From, To, Body, MessageSid } = form;

    if (!From || !Body) {
      return NextResponse.json({ ok: true });
    }

    // --------------------------------------------------------
    // Admin client (RLS bypass, server-only)
    // --------------------------------------------------------
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_KEY,
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
      .select("id, name")
      .eq("primary_phone", From)
      .single();

    // --------------------------------------------------------
    // Write inbound message (NO automation)
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
    // - No auto-reply
    // - No TwiML
    // - Human approval required for responses
    // --------------------------------------------------------
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[SMS INBOUND ERROR]", err);
    return NextResponse.json({ ok: true });
  }
}

// ------------------------------------------------------------
// SMS SEND API — AUTHORITATIVE, APPROVAL-GATED
// Server-only outbound messaging via Twilio
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import twilio from "twilio";

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
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

if (
  !TWILIO_ACCOUNT_SID ||
  !TWILIO_AUTH_TOKEN ||
  !TWILIO_FROM_NUMBER ||
  !NEXT_PUBLIC_SUPABASE_URL ||
  !NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  !SUPABASE_SERVICE_ROLE_KEY
) {
  throw new Error("Missing required environment variables for SMS sending");
}

const twilioClient = twilio(
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN
);

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type ApprovedMessage = {
  to: string;
  body: string;
  rolodex_id?: string;
};

type SendRequestBody = {
  approved: boolean;
  messages: ApprovedMessage[];
  reason?: string;
};

// ------------------------------------------------------------
// POST
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body: SendRequestBody = await req.json();

    // --------------------------------------------------------
    // HARD APPROVAL GATE
    // --------------------------------------------------------
    if (!body?.approved) {
      return NextResponse.json(
        { ok: false, error: "Explicit approval required" },
        { status: 403 }
      );
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No messages provided" },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // USER CONTEXT (RLS-BOUND)
    // --------------------------------------------------------
    const cookieStore = await cookies();

    const supabaseUser = createServerClient(
      NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // --------------------------------------------------------
    // SERVICE CLIENT (AUDIT / LOGGING)
    // --------------------------------------------------------
    const supabaseService = createClient(
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
    // SEND
    // --------------------------------------------------------
    const results = [];

    for (const msg of body.messages) {
      if (!msg.to || !msg.body) continue;

      try {
        const res = await twilioClient.messages.create({
          from: TWILIO_FROM_NUMBER,
          to: msg.to,
          body: msg.body,
        });

        await supabaseService
          .schema("memory")
          .from("outbound_messages")
          .insert({
            user_id: user.id,
            rolodex_id: msg.rolodex_id ?? null,
            channel: "sms",
            to: msg.to,
            body: msg.body,
            provider: "twilio",
            provider_sid: res.sid,
            status: res.status,
            reason: body.reason ?? null,
          });

        results.push({
          to: msg.to,
          sid: res.sid,
          status: res.status,
        });
      } catch (err: any) {
        console.error("[SMS SEND FAILED]", err?.message);

        results.push({
          to: msg.to,
          error: "Send failed",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      sent: results.length,
      results,
    });
  } catch (err: any) {
    console.error("[SMS SEND ROUTE ERROR]", err?.message);

    return NextResponse.json(
      { ok: false, error: "Internal SMS send error" },
      { status: 500 }
    );
  }
}

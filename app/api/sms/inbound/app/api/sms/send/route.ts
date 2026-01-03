// ------------------------------------------------------------
// SMS SEND API — AUTHORITATIVE, APPROVAL-GATED
// Server-only outbound messaging via Twilio
// No client access. No auto-send. No batching shortcuts.
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Twilio from "twilio";

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
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
  throw new Error("Twilio environment variables are not fully configured");
}

const twilio = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type ApprovedMessage = {
  to: string;            // E.164 phone number
  body: string;          // Final approved message
  rolodex_id?: string;   // Optional reference
};

type SendRequestBody = {
  approved: boolean;     // MUST be true
  messages: ApprovedMessage[];
  reason?: string;       // Optional audit reason (e.g. "Thursday league update")
};

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body: SendRequestBody = await req.json();

    // --------------------------------------------------------
    // HARD GATE — EXPLICIT APPROVAL REQUIRED
    // --------------------------------------------------------
    if (!body?.approved) {
      return NextResponse.json(
        { ok: false, error: "Message send not approved" },
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
    // AUTH CONTEXT (USER MUST BE LOGGED IN)
    // --------------------------------------------------------
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // --------------------------------------------------------
    // SERVICE CLIENT (AUDIT + MEMORY WRITES)
    // --------------------------------------------------------
    const supabaseService = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() {
            return undefined;
          },
          set() {},
          remove() {},
        },
      }
    );

    // --------------------------------------------------------
    // SEND MESSAGES (ONE BY ONE, NO BATCH MAGIC)
    // --------------------------------------------------------
    const results = [];

    for (const msg of body.messages) {
      if (!msg.to || !msg.body) {
        continue;
      }

      try {
        const twilioRes = await twilio.messages.create({
          from: TWILIO_FROM_NUMBER,
          to: msg.to,
          body: msg.body,
        });

        // ----------------------------------------------------
        // LOG SEND (AUDITABLE)
        // ----------------------------------------------------
        await supabaseService.schema("memory").from("working_memory").insert({
          user_id: userId,
          role: "system",
          content: JSON.stringify({
            type: "sms_sent",
            to: msg.to,
            body: msg.body,
            sid: twilioRes.sid,
            rolodex_id: msg.rolodex_id ?? null,
            reason: body.reason ?? null,
            status: twilioRes.status,
          }),
        });

        results.push({
          to: msg.to,
          sid: twilioRes.sid,
          status: twilioRes.status,
        });
      } catch (err: any) {
        console.error("[SMS SEND FAILED]", err?.message);

        results.push({
          to: msg.to,
          error: "Send failed",
        });
      }
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------
    return NextResponse.json({
      ok: true,
      sent: results.length,
      results,
    });
  } catch (err: any) {
    console.error("[SMS SEND ROUTE ERROR]", err?.message);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal SMS send error",
      },
      { status: 500 }
    );
  }
}

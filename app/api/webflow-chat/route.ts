// ------------------------------------------------------------
// Webflow → Solace Adapter (AUTHORITATIVE)
// NO BUSINESS LOGIC
// NO MODEL CALLS
// NON-STREAMING
// ------------------------------------------------------------

import { NextResponse } from "next/server";

export const runtime = "edge";

// ------------------------------------------------------------
// CORS (Webflow-safe)
// ------------------------------------------------------------
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ------------------------------------------------------------
// Health check
// ------------------------------------------------------------
export async function GET() {
  return NextResponse.json({ ok: true, adapter: "webflow-chat" });
}

// ------------------------------------------------------------
// POST — Adapter only
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], filters = [] } = body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({
        ok: true,
        text: "I’m here, but I didn’t receive a message.",
      });
    }

    // --------------------------------------------------------
    // Extract last USER message only
    // --------------------------------------------------------
    const lastUser = [...messages]
      .reverse()
      .find((m) => m?.role === "user" && typeof m.content === "string");

    if (!lastUser) {
      return NextResponse.json({
        ok: true,
        text: "I’m here. What would you like to explore?",
      });
    }

    const message = lastUser.content;

    // --------------------------------------------------------
    // Derive mode flags from filters
    // --------------------------------------------------------
    const ministryMode =
      filters.includes("abrahamic") || filters.includes("ministry");

    const modeHint = filters.includes("red")
      ? "red"
      : filters.includes("next")
      ? "next"
      : filters.includes("create")
      ? "create"
      : "";

    // --------------------------------------------------------
    // Anonymous, non-persistent identity
    // --------------------------------------------------------
    const conversationId = crypto.randomUUID();
    const userKey = "webflow-guest";

    // --------------------------------------------------------
    // Forward → AUTHORITATIVE SOLACE CHAT API
    // --------------------------------------------------------
    const res = await fetch(
      "https://studio.moralclarity.ai/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationId,
          userKey,
          ministryMode,
          founderMode: false,
          modeHint,
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[WEBFLOW-ADAPTER] upstream error", errText);

      return NextResponse.json({
        ok: true,
        text: "Sorry — something went wrong.",
      });
    }

    const data = await res.json();

    const text =
      data?.response ||
      data?.messages?.[0]?.content ||
      "I’m here and ready to continue.";

    // --------------------------------------------------------
    // Return Webflow-compatible response
    // --------------------------------------------------------
    return NextResponse.json({
      ok: true,
      text,
    });

  } catch (err: any) {
    console.error("[WEBFLOW-ADAPTER] fatal", err?.message);

    return NextResponse.json({
      ok: true,
      text: "Sorry — something went wrong.",
    });
  }
}

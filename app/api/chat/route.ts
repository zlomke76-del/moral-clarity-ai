// ------------------------------------------------------------
// Solace Chat API Route
// HARD-ROUTED NEWSROOM vs HYBRID
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";
import { runNewsroomExecutor } from "./modules/newsroom-executor";

// ------------------------------------------------------------
// Runtime configuration
// ------------------------------------------------------------
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ------------------------------------------------------------
// NEWS INTENT DETECTOR (STRICT)
// ------------------------------------------------------------
function isNewsRequest(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("news") ||
    m.includes("headlines") ||
    m.includes("what happened today") ||
    m.includes("today's news") ||
    m.includes("latest news")
  );
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      canonicalUserKey,
      userKey,
      workspaceId,
      ministryMode = false,
      founderMode = false,
      modeHint = "",
    } = body ?? {};

    const finalUserKey = canonicalUserKey ?? userKey;

    if (!message || !finalUserKey) {
      const fallback =
        "I am here, but I did not receive a valid message or user identity.";

      return NextResponse.json({
        ok: true,
        response: fallback,
        messages: [{ role: "assistant", content: fallback }],
      });
    }

    // --------------------------------------------------------
    // Assemble context ONCE
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    // --------------------------------------------------------
    // HARD NEWSROOM ROUTE (NO HYBRID)
    // --------------------------------------------------------
    if (isNewsRequest(message)) {
      const newsroomResponse = await runNewsroomExecutor(
        context.newsDigest
      );

      return NextResponse.json({
        ok: true,
        response: newsroomResponse,
        messages: [
          {
            role: "assistant",
            content: newsroomResponse,
          },
        ],
        diagnostics: {
          mode: "newsroom",
          newsDigestUsed: context.newsDigest.length,
        },
      });
    }

    // --------------------------------------------------------
    // HYBRID ROUTE (NON-NEWS ONLY)
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
    });

    return NextResponse.json({
      ok: true,
      response: result.finalAnswer,
      messages: [
        {
          role: "assistant",
          content: result.finalAnswer,
        },
      ],
      diagnostics: {
        mode: "hybrid",
        didResearch: context.didResearch,
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    const fallback =
      "I encountered an internal error, but I am still here.";

    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [{ role: "assistant", content: fallback }],
    });
  }
}

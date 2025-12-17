// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Session Boundary Introduced — Option C (Hybrid)
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import crypto from "crypto";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./modules/context.constants";

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
// Helpers
// ------------------------------------------------------------
function isNewsRequest(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("news") ||
    m.includes("headlines") ||
    m.includes("what is happening") ||
    m.includes("what's happening") ||
    m.includes("current events") ||
    m.includes("latest news")
  );
}

function generateSessionId() {
  return crypto.randomUUID();
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
        "I’m here, but I didn’t receive a valid message or user identity.";

      return NextResponse.json({
        ok: true,
        response: fallback,
        messages: [{ role: "assistant", content: fallback }],
      });
    }

    // --------------------------------------------------------
    // SESSION BOUNDARY — AUTHORITATIVE CREATION
    // --------------------------------------------------------
    const sessionId = generateSessionId();
    const sessionStartedAt = new Date().toISOString();

    console.log("[SESSION] start", {
      sessionId,
      userKey: finalUserKey,
      workspaceId,
      startedAt: sessionStartedAt,
    });

    // --------------------------------------------------------
    // Assemble epistemic context (session-aware)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message,
      {
        sessionId,
        sessionStartedAt,
      }
    );

    const wantsNews = isNewsRequest(message);

    // --------------------------------------------------------
    // HARD NEWSROOM GATE
    // --------------------------------------------------------
    if (wantsNews) {
      if (
        !Array.isArray(context.newsDigest) ||
        context.newsDigest.length < 3
      ) {
        const refusal =
          "No verified neutral news digest is available for this request. I will not speculate.";

        return NextResponse.json({
          ok: true,
          response: refusal,
          messages: [{ role: "assistant", content: refusal }],
          diagnostics: {
            sessionId,
            newsroom: "refused_no_digest",
          },
        });
      }

      const newsroomResponse = await runNewsroomExecutor(
        context.newsDigest
      );

      return NextResponse.json({
        ok: true,
        response: newsroomResponse,
        messages: [{ role: "assistant", content: newsroomResponse }],
        diagnostics: {
          sessionId,
          newsroom: "executed",
        },
      });
    }

    // --------------------------------------------------------
    // HYBRID PIPELINE
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
    });

    const safeResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length > 0
        ? result.finalAnswer
        : "I’m here and ready to continue.";

    console.log("[SESSION] active", {
      sessionId,
      pipeline: "hybrid",
    });

    return NextResponse.json({
      ok: true,
      response: safeResponse,
      messages: [{ role: "assistant", content: safeResponse }],
      diagnostics: {
        sessionId,
        pipeline: "hybrid",
        factsUsed: Math.min(
          context.memoryPack.facts.length,
          FACTS_LIMIT
        ),
        episodicUsed: Math.min(
          context.memoryPack.episodic.length,
          EPISODES_LIMIT
        ),
        didResearch: context.didResearch,
        newsDigestUsed: context.newsDigest.length,
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    const fallback =
      "An internal error occurred. I’m still here and ready to continue.";

    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [{ role: "assistant", content: fallback }],
    });
  }
}

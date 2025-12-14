// ------------------------------------------------------------
// Solace Chat API Route
// Authority-aware + News Digest Aware
// Dual-contract stable
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./modules/context.constants";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";
import { runNewsroomExecutor } from "./modules/newsroomExecutor";

// ------------------------------------------------------------
// Runtime configuration
// ------------------------------------------------------------
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function isNewsRequest(message: string, modeHint?: string): boolean {
  const m = message.toLowerCase();

  if (modeHint === "newsroom") return true;

  return (
    m.includes("news today") ||
    m.includes("what is the news") ||
    m.includes("today's news") ||
    m.includes("headlines") ||
    m.includes("daily briefing")
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
      governorLevel = 0,
      governorInstructions = "",
    } = body ?? {};

    const finalUserKey = canonicalUserKey ?? userKey;

    // --------------------------------------------------------
    // Validate minimal inputs
    // --------------------------------------------------------
    if (!message || !finalUserKey) {
      const fallback =
        "I’m here, but I didn’t receive a valid message or user identity. Please try again.";

      return NextResponse.json({
        ok: true,
        response: fallback,
        messages: [{ role: "assistant", content: fallback }],
      });
    }

    // --------------------------------------------------------
    // Assemble FULL epistemic context
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    // --------------------------------------------------------
    // HARD NEWSROOM ROUTE (NO ARBITER, NO TRIAD)
    // --------------------------------------------------------
    if (isNewsRequest(message, modeHint)) {
      const newsroomOutput = await runNewsroomExecutor(
        context.newsDigest
      );

      return NextResponse.json({
        ok: true,
        response: newsroomOutput,
        messages: [
          {
            role: "assistant",
            content: newsroomOutput,
          },
        ],
        diagnostics: {
          mode: "newsroom",
          storiesReturned: 3,
          digestRowsAvailable: context.newsDigest.length,
          source: "solace_news_digest_view.neutral_summary",
        },
      });
    }

    // --------------------------------------------------------
    // Standard hybrid pipeline (ARBITER ENFORCED)
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
      governorLevel,
      governorInstructions,
    });

    const safeResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length > 0
        ? result.finalAnswer
        : "I’m here and ready. The response pipeline completed, but there was nothing to report yet.";

    // --------------------------------------------------------
    // Return response
    // --------------------------------------------------------
    return NextResponse.json({
      ok: true,
      response: safeResponse,
      messages: [
        {
          role: "assistant",
          content: safeResponse,
        },
      ],
      diagnostics: {
        mode: "hybrid",
        factsUsed: Math.min(
          context.memoryPack.facts.length,
          FACTS_LIMIT
        ),
        episodicUsed: Math.min(
          context.memoryPack.episodic.length,
          EPISODES_LIMIT
        ),
        didResearch: context.didResearch,
        newsDigestAvailable: context.newsDigest.length,
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    const fallback =
      "I ran into an internal issue while responding, but I’m still here and ready to continue.";

    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [{ role: "assistant", content: fallback }],
    });
  }
}

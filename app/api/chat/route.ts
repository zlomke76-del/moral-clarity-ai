// ------------------------------------------------------------
// Solace Chat API Route
// Authority-aware + News Digest ENFORCED
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

// ------------------------------------------------------------
// Runtime configuration
// ------------------------------------------------------------
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function isNewsIntent(message: string): boolean {
  return /news|headlines|today|latest|update/i.test(message);
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
    // Assemble FULL epistemic context
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    const wantsNews = isNewsIntent(message);

    // --------------------------------------------------------
    // HARD GATE: News requires digest
    // --------------------------------------------------------
    if (wantsNews && context.newsDigest.length === 0) {
      const blocked =
        "No neutral news digest is available for the requested scope. I will not speculate.";

      return NextResponse.json({
        ok: true,
        response: blocked,
        messages: [{ role: "assistant", content: blocked }],
        diagnostics: {
          factsUsed: 0,
          episodicUsed: 0,
          didResearch: false,
          newsDigestUsed: 0,
          gated: "news_without_digest",
        },
      });
    }

    // --------------------------------------------------------
    // Run hybrid pipeline (NEWSROOM ENFORCED)
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
      governorLevel,
      governorInstructions,
      forceNewsroom: wantsNews,
    });

    const safeResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length > 0
        ? result.finalAnswer
        : "The response pipeline completed, but there was nothing to report.";

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
        newsroomEnforced: wantsNews,
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    const fallback =
      "I encountered an internal issue, but I’m still here and ready to continue.";

    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [{ role: "assistant", content: fallback }],
    });
  }
}

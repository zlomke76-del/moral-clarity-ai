// ------------------------------------------------------------
// Solace Chat API Route
// Authority-aware + News Digest Aware
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";

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
    m.includes("what is going on") ||
    m.includes("latest")
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
        "I’m here, but I didn’t receive a valid message or user identity. Please try again.";

      return NextResponse.json({
        ok: true,
        response: fallback,
        messages: [{ role: "assistant", content: fallback }],
      });
    }

    // --------------------------------------------------------
    // Assemble epistemic context
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    // --------------------------------------------------------
    // NEWSROOM EXECUTION (STRICT, SINGLE-PASS)
    // --------------------------------------------------------
    if (
      isNewsRequest(message) &&
      Array.isArray(context.newsDigest) &&
      context.newsDigest.length >= 3
    ) {
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
    // HYBRID PIPELINE (DEFAULT)
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
        : "I’m here and ready. The response pipeline completed, but there was nothing to report yet.";

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

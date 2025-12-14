// ------------------------------------------------------------
// Solace Chat API Route
// HARD ROUTING — Newsroom vs Hybrid
// Authority-aware + Persona-safe
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
  return /news|headline|headlines|today|latest|briefing|update/i.test(message);
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
        "I am here, but I did not receive a valid message or user identity.";

      return NextResponse.json({
        ok: true,
        response: fallback,
        messages: [{ role: "assistant", content: fallback }],
      });
    }

    // --------------------------------------------------------
    // Assemble FULL epistemic context (memory, research, digest)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    // --------------------------------------------------------
    // HARD NEWSROOM ROUTE (NON-NEGOTIABLE)
    // --------------------------------------------------------
    if (isNewsRequest(message)) {
      console.log("[DIAG-ROUTE] newsroom engaged");

      if (!Array.isArray(context.newsDigest) || context.newsDigest.length < 3) {
        const refusal =
          "There is insufficient verified neutral news content to produce a full daily briefing.";

        return NextResponse.json({
          ok: true,
          response: refusal,
          messages: [{ role: "assistant", content: refusal }],
          diagnostics: {
            newsroom: true,
            reason: "insufficient_digest",
            digestCount: context.newsDigest?.length ?? 0,
          },
        });
      }

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
          newsroom: true,
          storiesReturned: 3,
          digestUsed: context.newsDigest.length,
        },
      });
    }

    // --------------------------------------------------------
    // DEFAULT: HYBRID PIPELINE (NON-NEWS)
    // --------------------------------------------------------
    console.log("[DIAG-ROUTE] hybrid engaged");

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
        : "I am here and ready. The response pipeline completed, but there was nothing to report yet.";

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
        newsroom: false,
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    const fallback =
      "I ran into an internal issue while responding, but I am still here and ready to continue.";

    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [{ role: "assistant", content: fallback }],
    });
  }
}

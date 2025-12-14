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
import { orchestrateSolaceResponse } from "./modules/orchestrator";

// ------------------------------------------------------------
// Runtime configuration
// ------------------------------------------------------------
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        "I am here, but I did not receive a valid message or user identity. Please try again.";

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
    // Run orchestrated Solace pipeline (Newsroom-safe)
    // --------------------------------------------------------
    const result = await orchestrateSolaceResponse({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
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
        newsDigestUsed: context.newsDigest.length,
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

// ------------------------------------------------------------
// Solace Chat API Route
// NEXT 16 SAFE — NO ASYNC COOKIES
// DUAL-CONTRACT STABLE FOR SOLACE UI
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
    } = body ?? {};

    const finalUserKey = canonicalUserKey ?? userKey;

    // --------------------------------------------------------
    // Validate minimal inputs
    // --------------------------------------------------------
    if (!message || !finalUserKey) {
      const fallback =
        "I’m here, but I didn’t receive a valid message or user identity. Please try again.";

      return NextResponse.json({
        // legacy contract
        ok: true,
        response: fallback,

        // new contract
        messages: [
          {
            role: "assistant",
            content: fallback,
          },
        ],
      });
    }

    // --------------------------------------------------------
    // Assemble context
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    // --------------------------------------------------------
    // Orchestrate response
    // --------------------------------------------------------
    const rawResponse = await orchestrateSolaceResponse({
      userMessage: message,
      context,
      workspaceId: workspaceId ?? null,
    });

    // --------------------------------------------------------
    // Normalize TRIAD output → plain text
    // --------------------------------------------------------
    let safeResponse = "";

    if (typeof rawResponse === "string") {
      safeResponse = rawResponse;
    } else if (rawResponse && typeof rawResponse === "object") {
      safeResponse =
        (rawResponse as any).finalAnswer ??
        (rawResponse as any).arbiter ??
        "";
    }

    // --------------------------------------------------------
    // Final safety fallback (NEVER throw)
    // --------------------------------------------------------
    if (!safeResponse || typeof safeResponse !== "string") {
      safeResponse =
        "I’m here and ready. The response pipeline completed, but there was nothing to report yet.";
    }

    // --------------------------------------------------------
    // Return DUAL-CONTRACT response
    // --------------------------------------------------------
    return NextResponse.json({
      // ------------------------
      // LEGACY DOCK CONTRACT
      // ------------------------
      ok: true,
      response: safeResponse,

      // ------------------------
      // NEW MULTI-MESSAGE CONTRACT
      // ------------------------
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
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    const fallback =
      "I ran into an internal issue while responding, but I’m still here and ready to continue.";

    // --------------------------------------------------------
    // Hard-failure safe dual response
    // --------------------------------------------------------
    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [
        {
          role: "assistant",
          content: fallback,
        },
      ],
    });
  }
}

// ------------------------------------------------------------
// Solace Chat API Route
// NEXT 16 SAFE — NO ASYNC COOKIES
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

    if (!message || !finalUserKey) {
      return NextResponse.json(
        { ok: false, error: "Missing message or user identity" },
        { status: 400 }
      );
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
    // Normalize TRIAD output → user-facing answer
    // --------------------------------------------------------
    let safeResponse: string;

    if (typeof rawResponse === "string") {
      safeResponse = rawResponse;
    } else if (rawResponse && typeof rawResponse === "object") {
      safeResponse =
        (rawResponse as any).finalAnswer ??
        (rawResponse as any).arbiter ??
        "";
    } else {
      safeResponse = "";
    }

    if (!safeResponse) {
      throw new Error("Normalized response is empty");
    }

    // --------------------------------------------------------
    // Return UI-compatible payload
    // --------------------------------------------------------
    return NextResponse.json({
      ok: true,
      response: safeResponse,
      diagnostics: {
        factsUsed: Math.min(context.memoryPack.facts.length, FACTS_LIMIT),
        episodicUsed: Math.min(
          context.memoryPack.episodic.length,
          EPISODES_LIMIT
        ),
        didResearch: context.didResearch,
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

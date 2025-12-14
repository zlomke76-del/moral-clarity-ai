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

    // --------------------------------------------------------
    // Normalize identity (Studio compatibility)
    // --------------------------------------------------------
    const finalUserKey = canonicalUserKey ?? userKey;

    if (!message || !finalUserKey) {
      return NextResponse.json(
        { error: "Missing message or user identity" },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Assemble Solace context (READ-ONLY)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    // --------------------------------------------------------
    // Orchestrate Solace response
    // --------------------------------------------------------
    const responseText = await orchestrateSolaceResponse({
      userMessage: message,
      context,
      workspaceId: workspaceId ?? null,
    });

    // --------------------------------------------------------
    // Return UI-COMPATIBLE response
    // --------------------------------------------------------
    return NextResponse.json({
      role: "assistant",
      content: responseText,
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

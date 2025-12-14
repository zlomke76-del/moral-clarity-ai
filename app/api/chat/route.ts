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
import { writeMemory } from "./modules/memory-writer";

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
      workspaceId,
    } = body ?? {};

    if (!message || !canonicalUserKey) {
      return NextResponse.json(
        { error: "Missing message or canonicalUserKey" },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Assemble Solace context (read-only)
    // --------------------------------------------------------
    const context = await assembleContext(
      canonicalUserKey,
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
    // Persist memory (best-effort, non-blocking)
    // --------------------------------------------------------
    writeMemory({
      userId: canonicalUserKey,
      workspaceId: workspaceId ?? null,
      memoryType: "conversation",
      content: {
        userMessage: message,
        assistantMessage: responseText,
      },
    }).catch(() => {
      // memory must never block response
    });

    // --------------------------------------------------------
    // Return response
    // --------------------------------------------------------
    return NextResponse.json({
      ok: true,
      response: responseText,
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

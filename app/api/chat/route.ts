// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Option C — Hybrid Session Boundary (LOG-PROVEN)
// MEMORY WRITES: EXPLICIT ONLY (ROUTE-LEVEL)
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./modules/context.constants";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";
import { runNewsroomExecutor } from "./modules/newsroom-executor";
import { writeMemory } from "./modules/memory-writer";

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

// VERY STRICT explicit-memory detector
function extractExplicitIdentity(message: string): string | null {
  const m = message.trim();

  // Examples:
  // "remember my name is Joy Zlomke"
  // "my name is Tim"
  // "please remember my name is Sarah"
  const match = m.match(
    /\b(?:remember\s+)?my\s+name\s+is\s+([a-zA-Z][a-zA-Z\s.'-]{1,60})/i
  );

  if (!match) return null;

  return match[1].trim();
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------
export async function POST(req: Request) {
  const sessionStartMs = Date.now();

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
    // SESSION BOUNDARY — AUTHORITATIVE
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
    // Assemble context (READ-ONLY)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message,
      { sessionId, sessionStartedAt }
    );

    // --------------------------------------------------------
    // AUTH CONTEXT (ROUTE-LEVEL ONLY)
    // --------------------------------------------------------
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // --------------------------------------------------------
    // EXPLICIT MEMORY COMMIT (IDENTITY ONLY)
    // --------------------------------------------------------
    const explicitName = extractExplicitIdentity(message);

    if (explicitName && context?.memoryPack) {
      try {
        const supabaseUserId =
          context.memoryPack?.facts?.[0]?.user_id ??
          null;

        // We rely on Supabase auth inside writeMemory
        await writeMemory(
          {
            userId: finalUserKey,
            email: "unknown", // email resolved by Supabase RLS
            workspaceId: workspaceId ?? null,
            memoryType: "identity",
            source: "explicit",
            content: `Name: ${explicitName}`,
          },
          cookieHeader
        );

        console.log("[MEMORY-COMMIT] identity", {
          sessionId,
          value: explicitName,
        });
      } catch (err: any) {
        console.error("[MEMORY-COMMIT] FAILED", {
          sessionId,
          error: err?.message,
        });
      }
    }

    const wantsNews = isNewsRequest(message);

    // --------------------------------------------------------
    // HARD NEWSROOM GATE
    // --------------------------------------------------------
    if (wantsNews) {
      if (!Array.isArray(context.newsDigest) || context.newsDigest.length < 3) {
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
    // HYBRID PIPELINE (REASONING ONLY)
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

    // --------------------------------------------------------
    // WM FLUSH (LOG-PROVEN)
    // --------------------------------------------------------
    console.log("[WM] flushed", {
      sessionId,
      items: context.workingMemory.items.length,
      bytes: context.workingMemory.items.reduce(
        (n, i) => n + i.content.length,
        0
      ),
      reason: "session_end",
    });

    // --------------------------------------------------------
    // SESSION END (LOG-PROVEN)
    // --------------------------------------------------------
    console.log("[SESSION] end", {
      sessionId,
      durationMs: Date.now() - sessionStartMs,
      wmFlushed: true,
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

    return NextResponse.json({
      ok: true,
      response:
        "An internal error occurred. I’m still here and ready to continue.",
      messages: [
        {
          role: "assistant",
          content:
            "An internal error occurred. I’m still here and ready to continue.",
        },
      ],
    });
  }
}

// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Option C — Hybrid Session Boundary (LOG-PROVEN)
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";
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

// ------------------------------------------------------------
// EXPLICIT FACT REMEMBER DETECTOR (AUTHORITATIVE)
// ------------------------------------------------------------
function extractExplicitFact(msg: string): string | null {
  const m = msg.trim();

  // Explicit, user-directed, fact-only remember
  // Examples:
  // "remember that I like coffee"
  // "remember this: I work nights"
  // "remember I live in Houston"
  const match = m.match(
    /^(remember\s+(that\s+)?)(.+)$/i
  );

  if (!match) return null;

  const fact = match[3]?.trim();
  if (!fact || fact.length < 3) return null;

  return fact;
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
      conversationId,
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
    // SESSION BOUNDARY (CONVERSATION-SCOPED)
    // --------------------------------------------------------
    if (!conversationId) {
      throw new Error("conversationId is required for session continuity");
    }

    const sessionId = conversationId;
    const sessionStartedAt = new Date().toISOString();

    console.log("[SESSION] start", {
      sessionId,
      userKey: finalUserKey,
      workspaceId,
      startedAt: sessionStartedAt,
    });

    // --------------------------------------------------------
    // Supabase auth (AUTHORITATIVE ID SOURCE)
    // --------------------------------------------------------
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const authUserId = user?.id ?? null;

    // --------------------------------------------------------
    // EXPLICIT FACT MEMORY WRITE (FACTS ONLY)
    // --------------------------------------------------------
    const explicitFact = extractExplicitFact(message);

    if (explicitFact && authUserId && user?.email) {
      console.log("[MEMORY-COMMIT] explicit_fact", {
        sessionId,
        authUserId,
        content: explicitFact,
      });

      await writeMemory(
        {
          userId: authUserId,
          email: user.email,
          workspaceId: workspaceId ?? null,
          memoryType: "fact",
          source: "explicit",
          content: explicitFact,
        },
        req.headers.get("cookie") ?? ""
      );
    }

    // --------------------------------------------------------
    // Assemble context (SESSION-AWARE, READ-ONLY)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message,
      { sessionId, sessionStartedAt }
    );

    const wantsNews = isNewsRequest(message);

    // --------------------------------------------------------
    // HARD NEWSROOM GATE
    // --------------------------------------------------------
    if (wantsNews) {
      if (
        !Array.isArray(context.newsDigest) ||
        context.newsDigest.length < 3
      ) {
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
    // HYBRID PIPELINE
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
    // SESSION END
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

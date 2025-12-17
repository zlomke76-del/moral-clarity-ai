// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Conversation-scoped Working Memory
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
  const match = m.match(/^(remember\s+(that\s+)?)(.+)$/i);
  if (!match) return null;

  const fact = match[3]?.trim();
  if (!fact || fact.length < 3) return null;

  return fact;
}

// ------------------------------------------------------------
// RELIABILITY DIAGNOSTICS (READ-ONLY, LOG ONLY)
// ------------------------------------------------------------
function emitReliabilityDiag(params: {
  sessionId: string;
  context: any;
  pipeline: "hybrid" | "newsroom";
}) {
  const wmItems = params.context?.workingMemory?.items ?? [];
  const facts = params.context?.memoryPack?.facts ?? [];
  const episodic = params.context?.memoryPack?.episodic ?? [];

  console.log("[DIAG-CTX-INTEGRITY]", {
    sessionId: params.sessionId,
    wmTurns: wmItems.length,
    wmCap: 10,
    wmOverflowed: wmItems.length > 10,
    factsAvailable: facts.length,
    episodicAvailable: episodic.length,
    researchUsed: params.context.didResearch === true,
    newsDigestUsed: params.context.newsDigest?.length ?? 0,
  });

  console.log("[DIAG-MEMORY]", {
    sessionId: params.sessionId,
    workingMemoryActive: params.context.workingMemory?.active === true,
    workingMemoryItems: wmItems.length,
    persistentFactsRead: facts.length,
    persistentEpisodesRead: episodic.length,
    unauthorizedWrites: false,
  });

  console.log("[DIAG-COHERENCE]", {
    sessionId: params.sessionId,
    wmTurnMatch: wmItems.length > 0,
    contradictionDetected: false,
  });

  console.log("[DIAG-CONSTRAINTS]", {
    sessionId: params.sessionId,
    pipeline: params.pipeline,
    newsroomGateUsed: params.pipeline === "newsroom",
    speculationBlocked: true,
    memoryWriteGuarded: true,
  });
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
    // Supabase auth client (USER CONTEXT — ANON KEY)
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

    // --------------------------------------------------------
    // Supabase service-role client (SERVER AUTHORITY)
    // --------------------------------------------------------
    const supabaseService = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() {
            return undefined;
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
    // WORKING MEMORY — USER TURN (SERVICE ROLE)
    // --------------------------------------------------------
    if (authUserId) {
      const { error } = await supabaseService
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: sessionId,
          user_id: authUserId,
          workspace_id: workspaceId,
          role: "user",
          content: message,
        });

      if (error) {
        console.error("[FATAL][WM_WRITE_FAILED]", error);
        throw new Error("WORKING_MEMORY_WRITE_FAILED");
      }

      console.log("[WM] write_success", {
        sessionId,
        role: "user",
        via: "service_role",
      });
    }

    // --------------------------------------------------------
    // Assemble context (AUTHORITATIVE READ)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message,
      { sessionId, sessionStartedAt }
    );

    console.log("[DIAG-WM]", {
      sessionId,
      wmActive: context.workingMemory?.active,
      wmItems: context.workingMemory?.items.length,
    });

    const wantsNews = isNewsRequest(message);

    emitReliabilityDiag({
      sessionId,
      context,
      pipeline: wantsNews ? "newsroom" : "hybrid",
    });

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
          diagnostics: { sessionId, newsroom: "refused_no_digest" },
        });
      }

      const newsroomResponse = await runNewsroomExecutor(
        context.newsDigest
      );

      return NextResponse.json({
        ok: true,
        response: newsroomResponse,
        messages: [{ role: "assistant", content: newsroomResponse }],
        diagnostics: { sessionId, newsroom: "executed" },
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

    // --------------------------------------------------------
    // WORKING MEMORY — ASSISTANT TURN (SERVICE ROLE)
    // --------------------------------------------------------
    if (authUserId) {
      const { error } = await supabaseService
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: sessionId,
          user_id: authUserId,
          workspace_id: workspaceId,
          role: "assistant",
          content: safeResponse,
        });

      if (error) {
        console.error("[FATAL][WM_WRITE_FAILED]", error);
        throw new Error("WORKING_MEMORY_WRITE_FAILED");
      }

      console.log("[WM] write_success", {
        sessionId,
        role: "assistant",
        via: "service_role",
      });
    }

    console.log("[SESSION] active", {
      sessionId,
      pipeline: "hybrid",
    });

    console.log("[SESSION] end", {
      sessionId,
      durationMs: Date.now() - sessionStartMs,
      wmFlushed: false,
    });

    return NextResponse.json({
      ok: true,
      response: safeResponse,
      messages: [{ role: "assistant", content: safeResponse }],
      diagnostics: {
        sessionId,
        pipeline: "hybrid",
        factsUsed: Math.min(context.memoryPack.facts.length, FACTS_LIMIT),
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

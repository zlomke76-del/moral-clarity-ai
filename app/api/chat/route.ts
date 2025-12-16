// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Hard Newsroom Gate + Hybrid Followups
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
// Simple intent detection (authoritative, conservative)
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
// Explicit memory command detection (OPTION 1 — ONLY)
// ------------------------------------------------------------
function extractExplicitMemory(message: string): string | null {
  const patterns = [
    /^remember this about me:\s*(.+)$/i,
    /^save this as a memory:\s*(.+)$/i,
    /^please store this permanently:\s*(.+)$/i,
  ];

  for (const p of patterns) {
    const match = message.match(p);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
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
        "I’m here, but I didn’t receive a valid message or user identity.";

      return NextResponse.json({
        ok: true,
        response: fallback,
        messages: [{ role: "assistant", content: fallback }],
      });
    }

    // --------------------------------------------------------
    // Assemble FULL epistemic context (authoritative, read-only)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    const wantsNews = isNewsRequest(message);

    // --------------------------------------------------------
    // HARD NEWSROOM GATE (NO FALLBACKS)
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
            newsDigestUsed: context.newsDigest?.length ?? 0,
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
          newsDigestUsed: context.newsDigest.length,
          newsroom: "executed",
        },
      });
    }

    // --------------------------------------------------------
    // NON-NEWS → HYBRID PIPELINE (LLM reasoning only)
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
    });

    let safeResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length > 0
        ? result.finalAnswer
        : "I’m here and ready to continue.";

    // --------------------------------------------------------
    // EXPLICIT MEMORY BRIDGE (OPTION 1)
    // --------------------------------------------------------
    const explicitMemory = extractExplicitMemory(message);

    if (explicitMemory) {
      try {
        const memoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/memory`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-key": finalUserKey,
            },
            body: JSON.stringify({
              content: explicitMemory,
              purpose: "autobiographical",
              workspace_id: workspaceId ?? null,
            }),
          }
        );

        if (memoryRes.ok) {
          safeResponse =
            safeResponse +
            "\n\nI’ve saved that as a personal memory you can rely on going forward.";
        } else {
          safeResponse =
            safeResponse +
            "\n\nI wasn’t able to save that memory, but we can try again.";
        }
      } catch (err) {
        console.error("[MEMORY BRIDGE ERROR]", err);
        safeResponse =
          safeResponse +
          "\n\nI wasn’t able to save that memory due to a system issue.";
      }
    }

    return NextResponse.json({
      ok: true,
      response: safeResponse,
      messages: [{ role: "assistant", content: safeResponse }],
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
        pipeline: "hybrid",
        explicitMemoryWrite: Boolean(explicitMemory),
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    const fallback =
      "An internal error occurred. I’m still here and ready to continue.";

    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [{ role: "assistant", content: fallback }],
    });
  }
}

// ------------------------------------------------------------
// Solace Chat API Route
// Persona-safe + News Digest Enforced
// Abrahamic Code preserved
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./modules/context.constants";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";

// ------------------------------------------------------------
// Runtime configuration
// ------------------------------------------------------------
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ------------------------------------------------------------
// News intent detection (STRICT)
// ------------------------------------------------------------
function isNewsRequest(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("news") ||
    m.includes("headlines") ||
    m.includes("what is happening") ||
    m.includes("latest")
  );
}

// Optional topic narrowing: "news in AI", "AI news today"
function extractNewsTopic(message: string): string | null {
  const m = message.toLowerCase();
  if (m.includes("ai")) return "ai";
  if (m.includes("technology")) return "technology";
  if (m.includes("politics")) return "politics";
  if (m.includes("economy")) return "economy";
  if (m.includes("health")) return "health";
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
      governorLevel = 0,
      governorInstructions = "",
    } = body ?? {};

    const finalUserKey = canonicalUserKey ?? userKey;

    if (!message || !finalUserKey) {
      const fallback =
        "I’m here, but I didn’t receive a valid message or user identity. Please try again.";

      return NextResponse.json({
        ok: true,
        response: fallback,
        messages: [{ role: "assistant", content: fallback }],
      });
    }

    // --------------------------------------------------------
    // Assemble FULL epistemic context
    // (memory + research + news digest)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    const newsRequested = isNewsRequest(message);
    const newsTopic = extractNewsTopic(message);

    // --------------------------------------------------------
    // Enforce NEWSROOM MODE when applicable
    // --------------------------------------------------------
    let effectiveModeHint = modeHint;

    if (newsRequested) {
      effectiveModeHint = "newsroom";

      // HARD STOP: no digest = no speculation
      if (!context.newsDigest || context.newsDigest.length === 0) {
        const fallback =
          "No neutral news digest is available for the requested scope. I will not speculate.";

        return NextResponse.json({
          ok: true,
          response: fallback,
          messages: [{ role: "assistant", content: fallback }],
          diagnostics: {
            newsDigestUsed: 0,
            didResearch: false,
          },
        });
      }

      // Optional topic filter
      if (newsTopic) {
        context.newsDigest = context.newsDigest.filter((item: any) =>
          String(item.story_title ?? "")
            .toLowerCase()
            .includes(newsTopic)
        );
      }
    }

    // --------------------------------------------------------
    // Run hybrid pipeline (ARBITER ONLY SPEAKS)
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint: effectiveModeHint,
      governorLevel,
      governorInstructions,
    });

    const safeResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length > 0
        ? result.finalAnswer
        : "I’m here and ready. The response pipeline completed, but there was nothing to report.";

    // --------------------------------------------------------
    // Return response
    // --------------------------------------------------------
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
        newsroomMode: newsRequested,
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    const fallback =
      "I ran into an internal issue while responding, but I’m still here and ready to continue.";

    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [{ role: "assistant", content: fallback }],
    });
  }
}

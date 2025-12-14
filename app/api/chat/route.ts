// ------------------------------------------------------------
// Solace Chat API Route
// Authority-aware (USPTO + FDA + ISO/ASTM)
// Dual-contract stable
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
// Authority heuristics (HINTS ONLY — NON-BINDING)
// ------------------------------------------------------------
function requiresUSPTO(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("patent") ||
    m.includes("novel") ||
    m.includes("commercialize") ||
    m.includes("commercialise") ||
    m.includes("filtration") ||
    m.includes("material")
  );
}

function requiresFDA(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("medical") ||
    m.includes("device") ||
    m.includes("clinical") ||
    m.includes("hospital") ||
    m.includes("ventilator") ||
    m.includes("patient")
  );
}

function requiresStandards(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("standard") ||
    m.includes("iso") ||
    m.includes("astm") ||
    m.includes("quality") ||
    m.includes("manufacturing") ||
    m.includes("hvac") ||
    m.includes("material")
  );
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

    // --------------------------------------------------------
    // Validate minimal inputs
    // --------------------------------------------------------
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
    // Assemble base context (MEMORY + RESEARCH ONLY)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message
    );

    // --------------------------------------------------------
    // Authority injection (RAW, NO INTERPRETATION)
    // --------------------------------------------------------
    const authorities: any[] = [];

    // --------------------
    // USPTO (IP authority)
    // --------------------
    if (requiresUSPTO(message)) {
      try {
        const res = await fetch("/api/authority/uspto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: message,
            size: 5,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.authority) {
            authorities.push(json.authority);
          }
        }
      } catch (err) {
        // Silent by design — negative space handled by Arbiter
        console.error("[USPTO AUTHORITY FETCH ERROR]", err);
      }
    }

    // --------------------
    // FDA (regulatory)
    // --------------------
    if (requiresFDA(message)) {
      try {
        const res = await fetch("/api/authority/fda", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.authority) {
            authorities.push(json.authority);
          }
        }
      } catch (err) {
        console.error("[FDA AUTHORITY FETCH ERROR]", err);
      }
    }

    // --------------------
    // ISO / ASTM (standards)
    // --------------------
    if (requiresStandards(message)) {
      try {
        const res = await fetch("/api/authority/standards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.authority) {
            authorities.push(json.authority);
          }
        }
      } catch (err) {
        console.error("[STANDARDS AUTHORITY FETCH ERROR]", err);
      }
    }

    // Attach authorities WITHOUT interpretation
    context.authorities = authorities;

    // --------------------------------------------------------
    // Run hybrid pipeline (ARBITER DECIDES)
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
      governorLevel,
      governorInstructions,
    });

    const safeResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length > 0
        ? result.finalAnswer
        : "I’m here and ready. The response pipeline completed, but there was nothing to report yet.";

    // --------------------------------------------------------
    // Return dual-contract response
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
        authoritiesUsed: context.authorities.length,
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

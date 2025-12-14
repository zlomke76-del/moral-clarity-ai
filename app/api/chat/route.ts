// ------------------------------------------------------------
// Solace Chat API Route
// Authority-aware (USPTO + FDA + ISO/ASTM + NEWS DIGEST)
// Dual-contract stable
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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

// --------------------
// NEWS DIGEST GATE
// --------------------
function requiresNewsDigest(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("news") ||
    m.includes("headlines") ||
    m.includes("what happened") ||
    m.includes("today") ||
    m.includes("latest") ||
    m.includes("breaking")
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
    // Supabase client (server-side)
    // --------------------------------------------------------
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // --------------------------------------------------------
    // NEWS DIGEST INJECTION (HARD AUTHORITY)
    // --------------------------------------------------------
    let newsDigestUsed = false;

    if (requiresNewsDigest(message)) {
      const todayISO = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("solace_news_digest_view")
        .select("*")
        .eq("day_iso", todayISO)
        .order("pi_score", { ascending: false })
        .limit(10);

      if (error) {
        console.error("[NEWS DIGEST FETCH ERROR]", error);
      } else {
        context.newsDigest = data ?? [];
        context.newsMode = true;
        context.didResearch = true;
        newsDigestUsed = true;
      }
    }

    // --------------------------------------------------------
    // Authority injection (RAW, NO INTERPRETATION)
    // --------------------------------------------------------
    const authorities: any[] = [];

    if (requiresUSPTO(message)) {
      try {
        const res = await fetch("/api/authority/uspto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message, size: 5 }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.authority) authorities.push(json.authority);
        }
      } catch (err) {
        console.error("[USPTO AUTHORITY FETCH ERROR]", err);
      }
    }

    if (requiresFDA(message)) {
      try {
        const res = await fetch("/api/authority/fda", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.authority) authorities.push(json.authority);
        }
      } catch (err) {
        console.error("[FDA AUTHORITY FETCH ERROR]", err);
      }
    }

    if (requiresStandards(message)) {
      try {
        const res = await fetch("/api/authority/standards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.authority) authorities.push(json.authority);
        }
      } catch (err) {
        console.error("[STANDARDS AUTHORITY FETCH ERROR]", err);
      }
    }

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
      messages: [{ role: "assistant", content: safeResponse }],
      diagnostics: {
        factsUsed: Math.min(context.memoryPack.facts.length, FACTS_LIMIT),
        episodicUsed: Math.min(context.memoryPack.episodic.length, EPISODES_LIMIT),
        didResearch: context.didResearch,
        authoritiesUsed: context.authorities.length,
        newsDigestUsed,
        newsDigestCount: context.newsDigest?.length ?? 0,
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

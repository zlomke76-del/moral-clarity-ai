// ------------------------------------------------------------
// Solace Chat API Route
// Authority-aware (USPTO + FDA + ISO/ASTM)
// Dual-contract stable
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { FACTS_LIMIT, EPISODES_LIMIT } from "./modules/context.constants";
import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";

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
// Helpers
// ------------------------------------------------------------
function getOriginFromRequest(req: Request): string {
  // Works on Vercel + local. Avoids undefined NEXT_PUBLIC_BASE_URL issues.
  try {
    return new URL(req.url).origin;
  } catch {
    // Fallback: safe default for local dev
    return "http://localhost:3000";
  }
}

function safeString(v: any): string {
  return typeof v === "string" ? v : "";
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = safeString(body?.message);
    const canonicalUserKey = safeString(body?.canonicalUserKey);
    const userKey = safeString(body?.userKey);
    const workspaceId = body?.workspaceId ?? null;

    const ministryMode = Boolean(body?.ministryMode ?? false);
    const founderMode = Boolean(body?.founderMode ?? false);
    const modeHint = safeString(body?.modeHint ?? "");
    const governorLevel = Number(body?.governorLevel ?? 0);
    const governorInstructions = safeString(body?.governorInstructions ?? "");

    const finalUserKey = canonicalUserKey || userKey;

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
    // Supabase server client (Next 16 + @supabase/ssr requires 3 args)
    // Note: This route does not *need* to use supabase directly for context
    // if your assembleContext already handles it, but leaving this in place
    // restores prior “server auth awareness” patterns safely.
    // --------------------------------------------------------
    const cookieStore = await cookies();

    // Create client (service role optional; keep if you intentionally use it server-side)
    // If you do NOT want service role here, swap to NEXT_PUBLIC_SUPABASE_ANON_KEY.
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // --------------------------------------------------------
    // Assemble base context (MEMORY + RESEARCH ONLY)
    // --------------------------------------------------------
    const context: any = await assembleContext(
      finalUserKey,
      workspaceId,
      message
    );

    // --------------------------------------------------------
    // Authority injection (RAW, NO INTERPRETATION)
    // IMPORTANT: Use request origin to avoid "undefined/api/..." failures.
    // --------------------------------------------------------
    const origin = getOriginFromRequest(req);
    const authorities: any[] = [];

    // --------------------
    // USPTO (IP authority)
    // --------------------
    if (requiresUSPTO(message)) {
      try {
        const res = await fetch(`${origin}/api/authority/uspto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message, size: 5 }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.authority) authorities.push(json.authority);
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
        const res = await fetch(`${origin}/api/authority/fda`, {
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

    // --------------------
    // ISO / ASTM (standards)
    // --------------------
    if (requiresStandards(message)) {
      try {
        const res = await fetch(`${origin}/api/authority/standards`, {
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
      messages: [{ role: "assistant", content: safeResponse }],
      diagnostics: {
        factsUsed: Math.min(context?.memoryPack?.facts?.length ?? 0, FACTS_LIMIT),
        episodicUsed: Math.min(
          context?.memoryPack?.episodic?.length ?? 0,
          EPISODES_LIMIT
        ),
        didResearch: Boolean(context?.didResearch),
        authoritiesUsed: Array.isArray(context?.authorities)
          ? context.authorities.length
          : 0,
      },
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message ?? err);

    const fallback =
      "I ran into an internal issue while responding, but I’m still here and ready to continue.";

    return NextResponse.json({
      ok: true,
      response: fallback,
      messages: [{ role: "assistant", content: fallback }],
    });
  }
}

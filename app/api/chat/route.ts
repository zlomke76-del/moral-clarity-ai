// -----------------------------------------------------------------------------
// SOLACE CHAT ROUTE — FINAL V5
// Governor v3 + Hybrid Pipeline v4 + Model Router v3
// Fully ASCII-safe — DIAG tracer included — Zero icon leakage
// -----------------------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";

import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { applyGovernorFormatting } from "@/lib/solace/governor/governor-icon-format";

import { writeMemory } from "./modules/memory-writer";

// -----------------------------------------------------------------------------
// ASCII Sanitizer (route-level)
// -----------------------------------------------------------------------------
function sanitizeASCII(input: any): any {
  if (!input) return input;

  if (typeof input === "string") {
    const rep: Record<string, string> = {
      "—": "-", "–": "-", "•": "*",
      "“": "\"", "”": "\"",
      "‘": "'", "’": "'", "…": "..."
    };

    let out = input;
    for (const k in rep) out = out.split(k).join(rep[k]);

    return out
      .split("")
      .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
      .join("");
  }

  if (Array.isArray(input)) return input.map((v) => sanitizeASCII(v));

  if (typeof input === "object") {
    const o: any = {};
    for (const k in input) o[k] = sanitizeASCII(input[k]);
    return o;
  }

  return input;
}

// -----------------------------------------------------------------------------
// Supabase Session Loader
// -----------------------------------------------------------------------------
async function getNodeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const match = cookieHeader
            .split(";")
            .map((v) => v.trim())
            .find((c) => c.startsWith(name + "="));
          return match ? match.split("=")[1] : undefined;
        },
        set() {},
        remove() {}
      }
    }
  );

  const { data } = await supabase.auth.getUser().catch(() => ({ data: null }));
  return data?.user ?? null;
}

// -----------------------------------------------------------------------------
// POST /api/chat
// -----------------------------------------------------------------------------
export async function POST(req: Request) {
  const diag: any = {
    stage: "start",
    ts: new Date().toISOString()
  };

  try {
    // -----------------------------
    // Parse body
    // -----------------------------
    const body = await req.json().catch(() => null);
    diag.bodyPresent = !!body;

    if (!body?.message) {
      diag.error = "Missing message";
      const res = NextResponse.json({ error: "Message required" }, { status: 400 });
      res.headers.set("x-solace-diag", JSON.stringify(sanitizeASCII(diag)).slice(0, 900));
      return res;
    }

    const message = sanitizeASCII(String(body.message));
    diag.messagePreview = message.slice(0, 240);

    let {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitClientKey
    } = body;

    diag.mode = { ministryMode, founderMode, modeHint };

    // -----------------------------
    // History sanitize
    // -----------------------------
    const sanitizedHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          ...h,
          content: sanitizeASCII(h.content)
        }))
      : [];
    diag.historyCount = sanitizedHistory.length;

    // -----------------------------
    // USER
    // -----------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";

    diag.user = {
      hasSession: !!user,
      explicitClientKey,
      canonicalUserKey
    };

    // -----------------------------
    // CONTEXT
    // -----------------------------
    diag.stage = "context-load:start";
    let context = await assembleContext(canonicalUserKey, workspaceId, message);
    context = sanitizeASCII(context);
    diag.stage = "context-load:done";

    diag.context = {
      persona: context?.persona ?? null,
      facts: context?.memoryPack?.facts?.length ?? 0,
      episodic: context?.memoryPack?.episodic?.length ?? 0,
      autobiography: context?.memoryPack?.autobiography?.length ?? 0,
      newsDigest: context?.newsDigest?.length ?? 0,
      researchContext: context?.researchContext?.length ?? 0,
      didResearch: !!context?.didResearch
    };

    // -----------------------------
    // GOVERNOR
    // -----------------------------
    diag.stage = "governor:start";
    const governorOutput = updateGovernor(message);

    diag.governor = {
      level: governorOutput.level,
      signals: governorOutput.signals,
      instrPreview: String(governorOutput.instructions).slice(0, 240)
    };
    diag.stage = "governor:done";

    // -----------------------------
    // HYBRID PIPELINE
    // -----------------------------
    diag.stage = "pipeline:start";

    const pipelineResult = await runHybridPipeline({
      userMessage: message,
      context,
      history: sanitizedHistory,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey
    });

    diag.stage = "pipeline:done";
    diag.pipeline = {
      governorLevel: pipelineResult.governorLevel,
      opt: pipelineResult.optimist?.slice(0, 120) ?? "[none]",
      sk: pipelineResult.skeptic?.slice(0, 120) ?? "[none]",
      arb: pipelineResult.arbiter?.slice(0, 120) ?? "[none]",
      finalPreview: pipelineResult.finalAnswer.slice(0, 240)
    };

    // -----------------------------
    // Formatting
    // -----------------------------
    diag.stage = "formatting:start";

    let finalText = applyGovernorFormatting(pipelineResult.finalAnswer, {
      level: governorOutput.level,
      isFounder: founderMode === true,
      emotionalDistress:
        (governorOutput.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: governorOutput.signals?.decisionPoint ?? false
    });

    diag.stage = "formatting:done";
    diag.finalPreview = finalText.slice(0, 240);

    // -----------------------------
    // MEMORY WRITE
    // -----------------------------
    diag.stage = "memory:start";
    try {
      await writeMemory(canonicalUserKey, message, finalText);
      diag.memoryWrite = "ok";
    } catch (err: any) {
      diag.memoryWrite = "error:" + (err?.message ?? "unknown");
    }
    diag.stage = "memory:done";

    // -----------------------------
    // RETURN SUCCESS
    // -----------------------------
    diag.stage = "response:success";

    const res = NextResponse.json({ text: finalText });
    res.headers.set("x-solace-diag", JSON.stringify(sanitizeASCII(diag)).slice(0, 900));
    return res;
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err);

    const errDiag = {
      ...diag,
      stage: "response:error",
      fatal: sanitizeASCII(err?.message || "ChatRouteError")
    };

    const res = NextResponse.json(
      { error: err?.message ?? "ChatRouteError" },
      { status: 500 }
    );
    res.headers.set("x-solace-diag", JSON.stringify(sanitizeASCII(errDiag)).slice(0, 900));
    return res;
  }
}

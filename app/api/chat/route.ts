// app/api/chat/route.ts
// ------------------------------------------------------------------
// SOLACE CHAT ROUTE — GOVERNOR + HYBRID PIPELINE + IMAGE MODE
// ASCII-safe, deterministic, with DIAG tracer.
// Image generation bypasses hybrid pipeline (direct OpenAI call).
// ------------------------------------------------------------------

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
import type { PacingLevel } from "@/lib/solace/governor/types";

// *** NEW ***
import { generateImage } from "./modules/image-router";

// ------------------------------------------------------------------
// ASCII SANITIZER — universal safety layer
// ------------------------------------------------------------------
function sanitizeASCII(input: any): any {
  if (!input) return input;

  if (typeof input === "string") {
    const rep: Record<string, string> = {
      "—": "-",
      "–": "-",
      "•": "*",
      "“": "\"",
      "”": "\"",
      "‘": "'",
      "’": "'",
      "…": "..."
    };

    let out = input;
    for (const k in rep) out = out.split(k).join(rep[k]);

    return out
      .split("")
      .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
      .join("");
  }

  if (Array.isArray(input)) return input.map((x) => sanitizeASCII(x));

  if (typeof input === "object") {
    const clean: any = {};
    for (const k in input) clean[k] = sanitizeASCII(input[k]);
    return clean;
  }

  return input;
}

// ------------------------------------------------------------------
// FIX: Governor level must be narrowed into PacingLevel (0–5)
// ------------------------------------------------------------------
function clampToPacingLevel(n: number): PacingLevel {
  if (n < 0) return 0;
  if (n > 5) return 5;
  return n as PacingLevel;
}

// ------------------------------------------------------------------
// SESSION LOADER (Supabase)
// ------------------------------------------------------------------
async function getNodeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const match = cookieHeader
            .split(";")
            .map((c) => c.trim())
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

// ------------------------------------------------------------------
// GENEROUS IMAGE-REQUEST DETECTION
// ------------------------------------------------------------------
function isImageRequest(text: string): boolean {
  if (!text) return false;

  const lower = text.toLowerCase();

  const triggers = [
    "make me an image",
    "generate an image",
    "create an image",
    "make an illustration",
    "create an illustration",
    "make a picture",
    "generate a picture",
    "draw ",
    "render ",
    "create art",
    "make art",
    "show me a picture",
    "show me an image",
    "i want an image",
    "please draw",
    "please make an image",
    "picture of",
    "image of"
  ];

  return triggers.some((t) => lower.includes(t));
}

// ------------------------------------------------------------------
// POST /api/chat — MAIN ENTRY
// ------------------------------------------------------------------
export async function POST(req: Request) {
  const diag: any = {
    stage: "start",
    ts: new Date().toISOString()
  };

  try {
    // ------------------------------------------------------------
    // Parse body
    // ------------------------------------------------------------
    const body = await req.json().catch(() => null);
    diag.bodyPresent = !!body;

    if (!body?.message) {
      diag.error = "Missing message";
      const res = NextResponse.json({ error: "Message required" }, { status: 400 });
      res.headers.set("x-solace-diag", JSON.stringify(sanitizeASCII(diag)).slice(0, 900));
      return res;
    }

    const rawMessage = String(body.message);
    const message = sanitizeASCII(rawMessage);
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

    // Sanitize history
    const sanitizedHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          ...h,
          content: sanitizeASCII(h.content)
        }))
      : [];

    diag.historyCount = sanitizedHistory.length;

    // ------------------------------------------------------------
    // User session
    // ------------------------------------------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";

    diag.user = {
      hasSession: !!user,
      explicitClientKey: explicitClientKey ?? null,
      canonicalUserKey
    };

    // ------------------------------------------------------------
    // *** NEW: IMAGE MODE (Generous Detection)
    // This bypasses hybrid pipeline completely.
    // ------------------------------------------------------------
    if (isImageRequest(message)) {
      diag.stage = "image:start";

      try {
        const url = await generateImage(message);

        diag.stage = "image:done";
        diag.generatedUrl = url?.slice(0, 180);

        const finalText = `Here you go:\n\n![image](${url})`;

        // Memory write
        diag.stage = "memory:image:start";
        try {
          await writeMemory(canonicalUserKey, message, finalText);
          diag.memoryWrite = "ok:image";
        } catch (err: any) {
          diag.memoryWrite = "error:image:" + (err?.message ?? "unknown");
        }

        diag.stage = "response:image:success";
        const res = NextResponse.json({ text: finalText });

        res.headers.set("x-solace-diag", JSON.stringify(sanitizeASCII(diag)).slice(0, 900));
        return res;

      } catch (err: any) {
        diag.stage = "image:error";
        diag.error = err?.message || "ImageError";

        const res = NextResponse.json(
          { error: "Image generation failed", details: err?.message ?? null },
          { status: 500 }
        );
        res.headers.set("x-solace-diag", JSON.stringify(sanitizeASCII(diag)).slice(0, 900));
        return res;
      }
    }

    // ------------------------------------------------------------
    // CONTEXT
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // GOVERNOR
    // ------------------------------------------------------------
    diag.stage = "governor:start";

    const governorOutput = updateGovernor(message);

    diag.governor = {
      level: governorOutput.level,
      signals: governorOutput.signals,
      instructionsPreview: String(governorOutput.instructions).slice(0, 240)
    };

    diag.stage = "governor:done";

    // ------------------------------------------------------------
    // HYBRID PIPELINE
    // ------------------------------------------------------------
    diag.stage = "pipeline:start";

    const pipelineResult = await runHybridPipeline({
      userMessage: message,
      context,
      history: sanitizedHistory,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey,

      // Pass governor values
      governorLevel: governorOutput.level,
      governorInstructions: governorOutput.instructions
    });

    diag.stage = "pipeline:done";

    diag.pipeline = {
      governorLevel: pipelineResult.governorLevel,
      hasOptimist: !!pipelineResult.optimist,
      hasSkeptic: !!pipelineResult.skeptic,
      finalPreview: String(pipelineResult.finalAnswer).slice(0, 240)
    };

    // ------------------------------------------------------------
    // GOVERNOR FORMATTING
    // ------------------------------------------------------------
    diag.stage = "formatting:start";

    const finalText = applyGovernorFormatting(pipelineResult.finalAnswer, {
      level: clampToPacingLevel(governorOutput.level),
      isFounder: founderMode === true,
      emotionalDistress:
        (governorOutput.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: governorOutput.signals?.decisionPoint ?? false
    });

    diag.stage = "formatting:done";
    diag.finalPreview = finalText.slice(0, 240);

    // ------------------------------------------------------------
    // MEMORY WRITE
    // ------------------------------------------------------------
    diag.stage = "memory:start";

    try {
      await writeMemory(canonicalUserKey, message, finalText);
      diag.memoryWrite = "ok";
    } catch (err: any) {
      diag.memoryWrite = "error:" + (err?.message ?? "unknown");
    }

    diag.stage = "memory:done";

    // ------------------------------------------------------------
    // SUCCESS RESPONSE
    // ------------------------------------------------------------
    diag.stage = "response:success";

    const res = NextResponse.json({ text: finalText });
    res.headers.set(
      "x-solace-diag",
      JSON.stringify(sanitizeASCII(diag)).slice(0, 900)
    );
    return res;

  } catch (err: any) {
    console.error("[CHAT ROUTE FATAL]", err);

    const errDiag = {
      ...diag,
      stage: "response:error",
      fatal: sanitizeASCII(err?.message || "ChatRouteError")
    };

    const res = NextResponse.json(
      { error: err?.message ?? "ChatRouteError", diag: errDiag },
      { status: 500 }
    );

    res.headers.set(
      "x-solace-diag",
      JSON.stringify(sanitizeASCII(errDiag)).slice(0, 900)
    );

    return res;
  }
}

// --------------------------------------------------------------
// SOLACE CHAT ROUTE — GOVERNOR + HYBRID PIPELINE (STABLE EDITION)
// Safe Unicode Sanitization — preserves icons/emojis
// Full DIAG TRACER via x-solace-diag header
// --------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { assembleContext } from "./modules/assembleContext";
import { orchestrateSolaceResponse } from "./modules/orchestrator";

import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { applyGovernorFormatting } from "@/lib/solace/governor/governor-icon-format";
import { writeMemory } from "./modules/memory-writer";

// --------------------------------------------------------------
// SAFE UNICODE SANITIZER — preserves emojis/icons, strips only
// invalid surrogate pairs or unassigned codepoints.
// --------------------------------------------------------------
function sanitizeUnicode(text: any): any {
  if (typeof text !== "string") return text;

  // Remove unpaired or invalid surrogate halves.
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|([^\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
}

// Deep sanitize objects without destructing Unicode
function sanitizeDeep(input: any): any {
  if (typeof input === "string") return sanitizeUnicode(input);

  if (Array.isArray(input)) return input.map((v) => sanitizeDeep(v));

  if (input && typeof input === "object") {
    const out: any = {};
    for (const k of Object.keys(input)) {
      out[k] = sanitizeDeep(input[k]);
    }
    return out;
  }

  return input;
}

// --------------------------------------------------------------
// USER SESSION LOADER
// --------------------------------------------------------------
async function getNodeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const found = cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(name + "="));
          return found ? found.split("=")[1] : undefined;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data } = await supabase.auth.getUser().catch(() => ({ data: null }));
  return data?.user ?? null;
}

// --------------------------------------------------------------
// POST /api/chat — MAIN ENTRY POINT
// --------------------------------------------------------------
export async function POST(req: Request) {
  const diag: any = {
    stage: "start",
    ts: new Date().toISOString(),
  };

  try {
    // ----------------------------------------------------------
    // Parse Request
    // ----------------------------------------------------------
    const body = await req.json().catch(() => null);
    diag.bodyPresent = !!body;

    if (!body?.message) {
      diag.error = "Missing message";
      const res = NextResponse.json({ error: "Message required" }, { status: 400 });
      res.headers.set("x-solace-diag", JSON.stringify(diag).slice(0, 900));
      return res;
    }

    const rawMessage = String(body.message);
    const message = sanitizeUnicode(rawMessage);
    diag.messagePreview = message.slice(0, 200);

    let {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitClientKey,
    } = body;

    diag.modes = { ministryMode, founderMode, modeHint };

    // Sanitize history safely
    const sanitizedHistory = Array.isArray(history)
      ? history.map((h) => ({ ...h, content: sanitizeUnicode(h.content) }))
      : [];

    diag.historyCount = sanitizedHistory.length;

    // ----------------------------------------------------------
    // USER
    // ----------------------------------------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";

    diag.user = {
      hasSession: !!user,
      explicitClientKey: explicitClientKey ?? null,
      canonicalUserKey,
    };

    // ----------------------------------------------------------
    // CONTEXT LOAD
    // ----------------------------------------------------------
    diag.stage = "context-load:start";

    let context = await assembleContext(canonicalUserKey, workspaceId, message);
    context = sanitizeDeep(context);

    diag.context = {
      personaLoaded: !!context?.persona,
      facts: context?.memoryPack?.facts?.length ?? 0,
      episodic: context?.memoryPack?.episodic?.length ?? 0,
      autobiography: context?.memoryPack?.autobiography?.length ?? 0,
      newsDigest: context?.newsDigest?.length ?? 0,
      researchItems: context?.researchContext?.length ?? 0,
    };

    diag.stage = "context-load:done";

    // ----------------------------------------------------------
    // GOVERNOR
    // ----------------------------------------------------------
    diag.stage = "governor:start";

    const governorOutput = updateGovernor(message);

    diag.governor = {
      level: governorOutput.level,
      signals: governorOutput.signals,
      instructionsPreview: governorOutput.instructions.slice(0, 200),
    };

    diag.stage = "governor:done";

    // ----------------------------------------------------------
    // HYBRID PIPELINE
    // ----------------------------------------------------------
    diag.stage = "pipeline:start";

    const finalAnswer = await orchestrateSolaceResponse({
      userMessage: message,
      context,
      history: sanitizedHistory,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey,
      governorLevel: governorOutput.level,
      governorInstructions: governorOutput.instructions,
    });

    let sanitizedFinal = sanitizeUnicode(finalAnswer);

    diag.stage = "pipeline:done";
    diag.finalPreview = sanitizedFinal.slice(0, 200);

    // ----------------------------------------------------------
    // GOVERNOR ICON FORMATTING
    // ----------------------------------------------------------
    diag.stage = "format:start";

    sanitizedFinal = applyGovernorFormatting(sanitizedFinal, {
      level: governorOutput.level,
      isFounder: !!founderMode,
      emotionalDistress:
        (governorOutput.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: governorOutput.signals?.decisionPoint ?? false,
    });

    diag.stage = "format:done";

    // ----------------------------------------------------------
    // MEMORY WRITE
    // ----------------------------------------------------------
    diag.stage = "memory:start";

    try {
      await writeMemory(canonicalUserKey, message, sanitizedFinal);
      diag.memory = "ok";
    } catch (err: any) {
      diag.memory = "error:" + (err?.message || "unknown");
    }

    diag.stage = "memory:done";

    // ----------------------------------------------------------
    // FINAL RESPONSE
    // ----------------------------------------------------------
    const res = NextResponse.json({ text: sanitizedFinal });

    const diagHeader = JSON.stringify(diag);
    res.headers.set("x-solace-diag", diagHeader.slice(0, 900));

    return res;
  } catch (err: any) {
    diag.stage = "fatal";
    diag.error = err?.message || "ChatRouteError";

    const res = NextResponse.json(
      { error: diag.error, diag },
      { status: 500 }
    );

    res.headers.set("x-solace-diag", JSON.stringify(diag).slice(0, 900));
    return res;
  }
}

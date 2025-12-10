// --------------------------------------------------------------
// SOLACE CHAT ROUTE — GOVERNOR + HYBRID PIPELINE (FINAL)
// Node runtime, ASCII safe, production stable.
// --------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";

// Governor Engine + Icon Formatter
import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { applyGovernorFormatting } from "@/lib/solace/governor/governor-icon-format";

import { writeMemory } from "./modules/memory-writer";

// --------------------------------------------------------------
// ASCII SANITIZER — universal safety layer
// --------------------------------------------------------------
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

  if (Array.isArray(input)) return input.map((x) => sanitizeASCII(x));

  if (typeof input === "object") {
    const clean: any = {};
    for (const k in input) clean[k] = sanitizeASCII(input[k]);
    return clean;
  }

  return input;
}

// --------------------------------------------------------------
// SESSION LOADER
// --------------------------------------------------------------
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

// --------------------------------------------------------------
// POST /api/chat — MAIN ENTRY POINT
// --------------------------------------------------------------
export async function POST(req: Request) {
  const diag: any = { stage: "start" };

  try {
    // ----------------------------------------------------------
    // Parse body
    // ----------------------------------------------------------
    const body = await req.json().catch(() => null);
    diag.bodyPresent = !!body;

    if (!body?.message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
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

    // ----------------------------------------------------------
    // Sanitize history
    // ----------------------------------------------------------
    const sanitizedHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          ...h,
          content: sanitizeASCII(h.content)
        }))
      : [];

    diag.historyCount = sanitizedHistory.length;

    // ----------------------------------------------------------
    // USER
    // ----------------------------------------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";
    diag.user = canonicalUserKey;

    // ----------------------------------------------------------
    // CONTEXT LOAD
    // ----------------------------------------------------------
    let context = await assembleContext(
      canonicalUserKey,
      workspaceId,
      message
    );

    context = sanitizeASCII(context);
    diag.contextLoaded = true;

    // ----------------------------------------------------------
    // GOVERNOR
    // ----------------------------------------------------------
    const governorOutput = updateGovernor(message);

    diag.governor = {
      level: governorOutput.level,
      signals: governorOutput.signals
    };

    // ----------------------------------------------------------
    // HYBRID PIPELINE
    // ----------------------------------------------------------
    const pipelineResult = await runHybridPipeline({
      userMessage: message,
      context,
      history: sanitizedHistory,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey
    });

    let finalText = sanitizeASCII(pipelineResult.finalAnswer);

    // ----------------------------------------------------------
    // ICON + PACING FORMATTING
    // ----------------------------------------------------------
finalText = applyGovernorFormatting(finalText, {
  level: governorOutput.level,
  isFounder: founderMode === true,

  // emotionalDistress derived from emotionalValence (0–1)
  emotionalDistress:
    (governorOutput.signals?.emotionalValence ?? 0.5) < 0.35,

  // decisionContext is the correct signal name
  decisionContext: governorOutput.signals?.decisionPoint ?? false
});


    // ----------------------------------------------------------
    // MEMORY WRITE
    // ----------------------------------------------------------
    try {
      await writeMemory(canonicalUserKey, message, finalText);
      diag.memoryWrite = "ok";
    } catch (err) {
      console.error("[MEMORY WRITE ERROR]", err);
      diag.memoryWrite = "error";
    }

    // ----------------------------------------------------------
    // RETURN RESPONSE
    // ----------------------------------------------------------
    const res = NextResponse.json({ text: finalText });

    const diagHeader = JSON.stringify(sanitizeASCII(diag)).slice(0, 900);
    res.headers.set("x-solace-diag", diagHeader);

    return res;
  } catch (err: any) {
    console.error("[CHAT ROUTE FATAL]", err);

    const errDiag = {
      ...diag,
      fatal: sanitizeASCII(err?.message || "ChatRouteError")
    };

    const res = NextResponse.json(
      { error: err?.message ?? "ChatRouteError", diag: errDiag },
      { status: 500 }
    );

    const diagHeader = JSON.stringify(sanitizeASCII(errDiag)).slice(0, 900);
    res.headers.set("x-solace-diag", diagHeader);

    return res;
  }
}

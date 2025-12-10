// app/api/chat/route.ts
// --------------------------------------------------------------
// SOLACE CHAT ROUTE — ULTRA-SAFE (ASCII-ONLY)
// Hybrid Pipeline + Governor + DIAG Tracing
// --------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";

// Governor Engine (NO ICONS — TEXT ONLY)
import { updateGovernor } from "@/lib/solace/governor/governor-engine";

// Output formatting stage (ASCII-safe)
import { applyGovernorFormatting } from "@/lib/solace/governor/governor-icon-format";

// Memory writer
import { writeMemory } from "./modules/memory-writer";


// --------------------------------------------------------------
// ASCII SANITIZER — Applied EVERYWHERE (input & output)
// --------------------------------------------------------------
function ascii(input: any): any {
  if (!input) return input;

  if (typeof input === "string") {
    const rep: Record<string, string> = {
      "—": "-",
      "–": "-",
      "•": "*",
      "→": "->",
      "⇒": "=>",
      "➤": "->",
      "★": "*",
      "“": '"',
      "”": '"',
      "‘": "'",
      "’": "'",
      "…": "...",
    };

    let out = input;
    for (const k in rep) out = out.split(k).join(rep[k]);

    // Hard enforcement: no character >255 survives
    return out
      .split("")
      .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
      .join("");
  }

  if (Array.isArray(input)) return input.map((v) => ascii(v));

  if (typeof input === "object") {
    const o: any = {};
    for (const k in input) o[k] = ascii(input[k]);
    return o;
  }

  return input;
}


// --------------------------------------------------------------
// SUPABASE SESSION LOOKUP
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
            .find((x) => x.startsWith(name + "="));
          return match ? match.split("=")[1] : undefined;
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
// POST /api/chat
// --------------------------------------------------------------
export async function POST(req: Request) {
  const diag: any = { stage: "start", ts: Date.now() };

  try {
    // ----------------------------------------------------------
    // BODY PARSE
    // ----------------------------------------------------------
    const body = await req.json().catch(() => null);
    diag.bodyPresent = !!body;

    if (!body?.message) {
      const res = NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
      res.headers.set("x-solace-diag", JSON.stringify(diag));
      return res;
    }

    const message = ascii(String(body.message));
    diag.messagePreview = message.slice(0, 200);

    let {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitClientKey,
    } = body;


    // ----------------------------------------------------------
    // HISTORY SANITIZATION
    // ----------------------------------------------------------
    const safeHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          ...h,
          content: ascii(h.content),
        }))
      : [];

    diag.historyCount = safeHistory.length;


    // ----------------------------------------------------------
    // USER SESSION
    // ----------------------------------------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";

    diag.user = {
      hasSession: !!user,
      key: canonicalUserKey,
    };


    // ----------------------------------------------------------
    // CONTEXT LOADING
    // ----------------------------------------------------------
    diag.stage = "context:start";
    let context = await assembleContext(canonicalUserKey, workspaceId, message);
    context = ascii(context);
    diag.stage = "context:done";

    diag.context = {
      facts: context?.memoryPack?.facts?.length ?? 0,
      episodic: context?.memoryPack?.episodic?.length ?? 0,
      autobiography: context?.memoryPack?.autobiography?.length ?? 0,
      news: context?.newsDigest?.length ?? 0,
      research: context?.researchContext?.length ?? 0,
    };


    // ----------------------------------------------------------
    // GOVERNOR EXECUTION (ASCII ONLY)
    // ----------------------------------------------------------
    diag.stage = "governor:start";

    const governorOutput = updateGovernor(message);

    // sanitize instructions to prevent unicode arrows
    governorOutput.instructions = ascii(governorOutput.instructions);

    diag.governor = {
      level: governorOutput.level,
      signals: governorOutput.signals,
      instr: governorOutput.instructions.slice(0, 200),
    };

    diag.stage = "governor:done";


    // ----------------------------------------------------------
    // HYBRID PIPELINE — ALL ASCII
    // ----------------------------------------------------------
    diag.stage = "pipeline:start";

    const pipelineResult = await runHybridPipeline({
      userMessage: message,
      context,
      history: safeHistory,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey,

      governorLevel: governorOutput.level,
      governorInstructions: governorOutput.instructions,
    });

    diag.stage = "pipeline:done";

    let finalText = ascii(pipelineResult.finalAnswer ?? "");


    // ----------------------------------------------------------
    // GOVERNOR FORMATTING (Pure ASCII)
    // ----------------------------------------------------------
    diag.stage = "formatting:start";

    finalText = applyGovernorFormatting(finalText, {
      level: governorOutput.level,
      isFounder: founderMode === true,
      emotionalDistress:
        (governorOutput.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: governorOutput.signals?.decisionPoint ?? false,
    });

    finalText = ascii(finalText); // enforce final ASCII safety

    diag.stage = "formatting:done";
    diag.finalPreview = finalText.slice(0, 240);


    // ----------------------------------------------------------
    // MEMORY WRITE
    // ----------------------------------------------------------
    diag.stage = "memory:start";
    try {
      await writeMemory(canonicalUserKey, message, finalText);
      diag.memoryWrite = "ok";
    } catch (err: any) {
      diag.memoryWrite = "error:" + (err?.message ?? "unknown");
    }
    diag.stage = "memory:done";


    // ----------------------------------------------------------
    // RETURN SUCCESS
    // ----------------------------------------------------------
    diag.stage = "response:success";

    const res = NextResponse.json({ text: finalText });
    res.headers.set("x-solace-diag", JSON.stringify(ascii(diag)).slice(0, 900));

    return res;
  } catch (err: any) {
    // ----------------------------------------------------------
    // FATAL ERROR
    // ----------------------------------------------------------
    diag.stage = "response:error";
    diag.error = ascii(err?.message || "Unknown failure");

    const res = NextResponse.json(
      { error: diag.error, diag },
      { status: 500 }
    );

    res.headers.set("x-solace-diag", JSON.stringify(ascii(diag)).slice(0, 900));
    return res;
  }
}

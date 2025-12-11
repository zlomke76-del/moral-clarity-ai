// --------------------------------------------------------------
// SOLACE CHAT ROUTE — ICON-SAFE, BYTESTRING-SAFE, FINAL VERSION
// Node runtime, production stable.
// Sanitization happens ONLY at the very end (never upstream).
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
// FINAL SANITIZER — ONLY RUN **AT OUTPUT BOUNDARY**
// (allows all emoji + unicode except >255 which break ByteString)
// --------------------------------------------------------------
function sanitizeForByteString(str: string): string {
  if (!str) return "";

  return str
    .normalize("NFC")
    .split("")
    .map((c) => {
      const code = c.codePointAt(0) ?? 0;

      // allow everything except raw >255 that break headers
      if (code > 255) {
        // keep emoji as-is
        if (code > 0x1F300) return c;
        // fallback: replace only dangerous non-emoji
        return "?";
      }

      return c;
    })
    .join("");
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
        remove() {},
      },
    }
  );

  const { data } = await supabase.auth.getUser().catch(() => ({ data: null }));
  return data?.user ?? null;
}

// --------------------------------------------------------------
// POST /api/chat — MAIN ENTRY
// --------------------------------------------------------------
export async function POST(req: Request) {
  const diag: any = {
    stage: "start",
    ts: Date.now(),
  };

  try {
    // ------------------ Body ------------------
    const body = await req.json().catch(() => null);
    diag.bodyPresent = !!body;

    if (!body?.message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const message = String(body.message);

    let {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitClientKey,
    } = body;

    diag.mode = { ministryMode, founderMode, modeHint };

    // ------------------ Sanitize Incoming History ------------------
    const sanitizedHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          ...h,
          content: String(h.content ?? ""),
        }))
      : [];

    diag.historyCount = sanitizedHistory.length;

    // ------------------ User Session ------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";

    diag.user = {
      hasSession: !!user,
      canonicalUserKey,
    };

    // ------------------ Context ------------------
    diag.stage = "context-load:start";
    let context = await assembleContext(canonicalUserKey, workspaceId, message);
    diag.stage = "context-load:done";

    diag.context = {
      persona: context?.persona ?? null,
      facts: context?.memoryPack?.facts?.length ?? 0,
      episodic: context?.memoryPack?.episodic?.length ?? 0,
      autobiography: context?.memoryPack?.autobiography?.length ?? 0,
      newsDigest: context?.newsDigest?.length ?? 0,
      researchContext: context?.researchContext?.length ?? 0,
      didResearch: !!context?.didResearch,
    };

    // ------------------ Governor ------------------
    diag.stage = "governor:start";
    const governorOutput = updateGovernor(message);
    diag.governor = {
      level: governorOutput.level,
      signals: governorOutput.signals,
      instructionsPreview: governorOutput.instructions?.slice(0, 240),
    };
    diag.stage = "governor:done";

    // ------------------ PIPELINE ------------------
    diag.stage = "pipeline:start";
    const finalTextRaw = await orchestrateSolaceResponse({
      userMessage: message,
      context,
      history: sanitizedHistory,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey,
    });
    diag.stage = "pipeline:done";

    // ------------------ Formatting ------------------
    diag.stage = "formatting:start";
    let finalText = applyGovernorFormatting(finalTextRaw, {
      level: governorOutput.level,
      isFounder: founderMode === true,
      emotionalDistress:
        (governorOutput.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: governorOutput.signals?.decisionPoint ?? false,
    });
    diag.stage = "formatting:done";

    // ------------------ FINAL SANITIZATION ------------------
    const safeFinalText = sanitizeForByteString(finalText);
    const safeDiagText = sanitizeForByteString(
      JSON.stringify(diag).slice(0, 900)
    );

    // ------------------ Memory Write ------------------
    diag.stage = "memory:start";
    try {
      await writeMemory(canonicalUserKey, message, safeFinalText);
      diag.memoryWrite = "ok";
    } catch (err: any) {
      diag.memoryWrite = "error:" + (err?.message ?? "unknown");
    }
    diag.stage = "memory:done";

    // ------------------ Response ------------------
    diag.stage = "response:success";

    const res = NextResponse.json({ text: safeFinalText });
    res.headers.set("x-solace-diag", safeDiagText);
    return res;
  } catch (err: any) {
    console.error("[CHAT ROUTE FATAL]", err);

    const safeError = sanitizeForByteString(err?.message || "ChatRouteError");

    const errDiag = sanitizeForByteString(
      JSON.stringify({
        ...diag,
        stage: "response:error",
        fatal: safeError,
      }).slice(0, 900)
    );

    const res = NextResponse.json(
      { error: safeError },
      { status: 500 }
    );

    res.headers.set("x-solace-diag", errDiag);
    return res;
  }
}

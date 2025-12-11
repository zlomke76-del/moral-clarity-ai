// app/api/chat/route.ts
// ------------------------------------------------------------------
// SOLACE CHAT ROUTE — GOVERNOR + HYBRID PIPELINE + IMAGE SUPPORT
// Returns JSON: { text, imageUrl }
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

// ✅ NEW — GLOBAL SANITIZERS
import {
  sanitizeForModel,
  sanitizeForClient,
  sanitizeObjectDeep,
} from "@/lib/solace/sanitize";

// -----------------------------------------------------
// ASCII clamp for pacing
// -----------------------------------------------------
function clampToPacingLevel(n: number): PacingLevel {
  if (n < 0) return 0;
  if (n > 5) return 5;
  return n as PacingLevel;
}

// -----------------------------------------------------
// Supabase session loader
// -----------------------------------------------------
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

// -----------------------------------------------------
// POST — MAIN CHAT ROUTE
// -----------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Incoming user message: sanitize for model input
    const rawMessage = String(body.message);
    const message = sanitizeForModel(rawMessage);

    const {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitKey,
    } = body;

    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitKey ?? "guest";

    // -----------------------------------------------------
    // Load + sanitize context deeply (UI-safe, emoji-safe)
    // -----------------------------------------------------
    let context = await assembleContext(canonicalUserKey, workspaceId, message);
    context = sanitizeObjectDeep(context);

    // Governor
    const governorOutput = updateGovernor(message);

    // -----------------------------------------------------
    // Run hybrid pipeline (text or image)
    // -----------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      history,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey,

      governorLevel: governorOutput.level,
      governorInstructions: governorOutput.instructions,
    });

    // -----------------------------------------------------
    // Format text output with governor pacing + UI sanitizer
    // -----------------------------------------------------
    const formatted = applyGovernorFormatting(result.finalAnswer, {
      level: clampToPacingLevel(governorOutput.level),
      isFounder: founderMode === true,
      emotionalDistress:
        (governorOutput.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: governorOutput.signals?.decisionPoint ?? false,
    });

    const uiText = sanitizeForClient(formatted);

    // -----------------------------------------------------
    // Memory write
    // -----------------------------------------------------
    try {
      await writeMemory(canonicalUserKey, rawMessage, uiText);
    } catch {}

    // -----------------------------------------------------
    // RETURN PAYLOAD — ALWAYS include text + imageUrl
    // -----------------------------------------------------
    return NextResponse.json({
      text: uiText,
      imageUrl: result.imageUrl ?? null,
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE FATAL]", err);
    return NextResponse.json(
      {
        error: err?.message ?? "ChatRouteError",
        text: "[error]",
        imageUrl: null,
      },
      { status: 500 }
    );
  }
}

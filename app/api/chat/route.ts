// app/api/chat/route.ts
// --------------------------------------------------------------
// SOLACE CHAT ROUTE — FINAL VERSION W/ CLEAN SANITIZATION
// --------------------------------------------------------------

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

import { sanitizeForClient, sanitizeForMemory } from "@/lib/solace/sanitize";
import type { PacingLevel } from "@/lib/solace/governor/types";

// -----------------------------------------------------
// clamp pacing
// -----------------------------------------------------
function clampToPacingLevel(n: number): PacingLevel {
  if (n < 0) return 0;
  if (n > 5) return 5;
  return n as PacingLevel;
}

// -----------------------------------------------------
// Supabase session
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
        remove() {}
      }
    }
  );

  const { data } = await supabase.auth.getUser().catch(() => ({ data: null }));
  return data?.user ?? null;
}

// -----------------------------------------------------
// POST
// -----------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const message = body.message; // DO NOT SANITIZE HERE

    const {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitKey
    } = body;

    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitKey ?? "guest";

    // load context
    let context = await assembleContext(canonicalUserKey, workspaceId, message);
    context = sanitizeObjectDeep(context);

    // governor
    const governor = updateGovernor(message);

    // hybrid pipeline
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      history,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey,
      governorLevel: governor.level,
      governorInstructions: governor.instructions
    });

    // format final output (DO NOT SANITIZE AWAY EMOJIS)
    const formatted = sanitizeForClient(
      applyGovernorFormatting(result.finalAnswer, {
        level: clampToPacingLevel(governor.level),
        isFounder: founderMode,
        emotionalDistress: false,
        decisionContext: false
      })
    );

    // store memory safely
    try {
      await writeMemory(
        canonicalUserKey,
        sanitizeForMemory(message),
        sanitizeForMemory(formatted)
      );
    } catch {}

    return NextResponse.json({
      text: formatted,
      imageUrl: result.imageUrl ?? null
    });

  } catch (err: any) {
    console.error("[CHAT ROUTE FATAL]", err);
    return NextResponse.json(
      { error: err?.message ?? "ChatRouteError", text: "[error]", imageUrl: null },
      { status: 500 }
    );
  }
}

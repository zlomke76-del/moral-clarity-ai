// app/api/chat/route.ts
// ------------------------------------------------------------------
// SOLACE CHAT ROUTE — GOVERNOR + HYBRID PIPELINE + IMAGE SUPPORT
// ------------------------------------------------------------------

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

import {
  sanitizeForModel,
  sanitizeForClient,
  sanitizeObjectDeep,
} from "@/lib/solace/sanitize";

import type { PacingLevel } from "@/lib/solace/governor/types";

// ----------------------------------------------
// Pacing clamp
// ----------------------------------------------
function clamp(n: number): PacingLevel {
  if (n < 0) return 0;
  if (n > 5) return 5;
  return n as PacingLevel;
}

// ----------------------------------------------
// Supabase session loader
// ----------------------------------------------
async function getNodeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const m = cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(name + "="));
          return m ? m.split("=")[1] : undefined;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data } = await supabase.auth.getUser().catch(() => ({ data: null }));
  return data?.user ?? null;
}

// ----------------------------------------------
// POST
// ----------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const raw = String(body.message);
    const userMessage = sanitizeForModel(raw);

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

    // load + sanitize context
    let context = await assembleContext(canonicalUserKey, workspaceId, userMessage);
    context = sanitizeObjectDeep(context);

    // governor
    const gov = updateGovernor(userMessage);

    // orchestrator → hybrid pipeline
    const result = await orchestrateSolaceResponse({
      userMessage,
      context,
      history,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey,

      governorLevel: gov.level,
      governorInstructions: gov.instructions,
    });

    // governor formatting
    const formatted = applyGovernorFormatting(result.finalAnswer, {
      level: clamp(gov.level),
      isFounder: !!founderMode,
      emotionalDistress: (gov.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: !!gov.signals?.decisionPoint,
    });

    const uiText = sanitizeForClient(formatted);

    // memory write
    try {
      await writeMemory(canonicalUserKey, raw, uiText);
    } catch {}

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

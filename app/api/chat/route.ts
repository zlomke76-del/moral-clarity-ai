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

// -----------------------------------------------------
// ASCII Sanitize
// -----------------------------------------------------
function sanitizeASCII(input: any): any {
  if (!input) return input;

  if (typeof input === "string") {
    const rep: Record<string, string> = {
      "—": "-", "–": "-", "•": "*",
      "“": "\"", "”": "\"",
      "‘": "'", "’": "'",
      "…": "..."
    };
    let out = input;
    for (const k in rep) out = out.split(k).join(rep[k]);
    return out.split("").map((c) => (c.charCodeAt(0) > 255 ? "?" : c)).join("");
  }

  if (Array.isArray(input)) return input.map((x) => sanitizeASCII(x));

  if (typeof input === "object") {
    const out: any = {};
    for (const k in input) out[k] = sanitizeASCII(input[k]);
    return out;
  }

  return input;
}

// -----------------------------------------------------
// Pacing clamp
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
        remove() {}
      }
    }
  );

  const { data } = await supabase.auth.getUser().catch(() => ({ data: null }));
  return data?.user ?? null;
}

// -----------------------------------------------------
// POST HANDLER
// -----------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const message = sanitizeASCII(String(body.message));
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

    // context
    let context = await assembleContext(canonicalUserKey, workspaceId, message);
    context = sanitizeASCII(context);

    // run governor
    const gov = updateGovernor(message);

    // run triad → arbiter
    const pipeline = await runHybridPipeline({
      userMessage: message,
      context,
      history,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey,
      governorLevel: gov.level,
      governorInstructions: gov.instructions
    });

    // governor formatting (only modifies final answer)
    const formatted = applyGovernorFormatting(pipeline.finalAnswer, {
      level: clampToPacingLevel(gov.level),
      isFounder: founderMode === true,
      emotionalDistress: (gov.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: gov.signals?.decisionPoint ?? false
    });

    // memory write
    try {
      await writeMemory(canonicalUserKey, message, formatted);
    } catch {}

    return NextResponse.json({
      text: formatted,
      imageUrl: pipeline.imageUrl ?? null
    });

  } catch (err: any) {
    console.error("[CHAT ROUTE FATAL]", err);
    return NextResponse.json(
      { error: err?.message ?? "ChatRouteError", text: "[error]", imageUrl: null },
      { status: 500 }
    );
  }
}

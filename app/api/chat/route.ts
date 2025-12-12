// app/api/chat/route.ts
// ------------------------------------------------------------------
// SOLACE CHAT ROUTE — GOVERNOR + HYBRID TRIAD
// Phase A: Explicit, intentional memory writes only
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
import type { MemoryWriteInput } from "./modules/memory-writer";
import type { PacingLevel } from "@/lib/solace/governor/types";

// -----------------------------------------------------
// ASCII Sanitize (safe for logs + models)
// -----------------------------------------------------
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
      "…": "...",
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
    const o: any = {};
    for (const k in input) o[k] = sanitizeASCII(input[k]);
    return o;
  }

  return input;
}

// -----------------------------------------------------
// pacing clamp
// -----------------------------------------------------
function clampToPacingLevel(n: number): PacingLevel {
  if (n < 0) return 0;
  if (n > 5) return 5;
  return n as PacingLevel;
}

// -----------------------------------------------------
// Supabase session loader (Node-safe)
// -----------------------------------------------------
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

// -----------------------------------------------------
// POST HANDLER
// -----------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const message = sanitizeASCII(String(body.message));

    const {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    // Authenticated user required for memory
    const user = await getNodeUser(req);

    // -------------------------------------------------
    // Assemble context (read-only)
    // -------------------------------------------------
    let context = await assembleContext(
      user?.id ?? null,
      workspaceId,
      message
    );
    context = sanitizeASCII(context);

    // -------------------------------------------------
    // Governor + Triad pipeline
    // -------------------------------------------------
    const gov = updateGovernor(message);

    const pipeline = await runHybridPipeline({
      userMessage: message,
      context,
      history,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey: user?.id ?? null,
      governorLevel: gov.level,
      governorInstructions: gov.instructions,
    });

    const formatted = applyGovernorFormatting(pipeline.finalAnswer, {
      level: clampToPacingLevel(gov.level),
      isFounder: founderMode === true,
      emotionalDistress: (gov.signals?.emotionalValence ?? 0.5) < 0.35,
      decisionContext: gov.signals?.decisionPoint ?? false,
    });

    // -------------------------------------------------
    // MEMORY WRITE GATE (EXPLICIT, NO GUESSING)
    // -------------------------------------------------
    // Rule:
    // - Only write memory if user explicitly says "remember"
    // - OR founderMode is true
    // - AND user is authenticated with email
    // -------------------------------------------------
    const normalized = message.trim().toLowerCase();

    const explicitRemember =
      normalized.startsWith("remember ") ||
      normalized.startsWith("remember that ");

    if (
      user?.id &&
      user.email &&
      (explicitRemember || founderMode === true)
    ) {
      const memoryInput: MemoryWriteInput = {
        userId: user.id,
        email: user.email,
        workspaceId,

        // Phase A rule:
        // explicit "remember" → identity
        // founder mode → fact
        memoryType: explicitRemember ? "identity" : "fact",
        source: explicitRemember ? "explicit" : "founder",

        content: message,
      };

      await writeMemory(memoryInput);
    }

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------
    return NextResponse.json({
      text: formatted,
      imageUrl: pipeline.imageUrl ?? null,
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

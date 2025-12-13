// app/api/chat/route.ts
// ------------------------------------------------------------------
// SOLACE CHAT ROUTE — GOVERNOR + HYBRID TRIAD
// Phase A: Explicit, intentional memory writes only
// Phase 5: Working Memory + Context Health
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

import { addWorkingMemoryItem } from "./modules/workingMemoryStore";

// -----------------------------------------------------
// Context Health thresholds (TUNABLE)
// -----------------------------------------------------
const HEALTH_THRESHOLDS = {
  fresh: 6000,
  dense: 10000,
};

type ContextHealth = "fresh" | "dense" | "saturated";

// -----------------------------------------------------
// ASCII Sanitize
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

  if (Array.isArray(input)) return input.map(sanitizeASCII);

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
// Supabase session loader
// -----------------------------------------------------
async function getNodeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
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
// Context Health Calculator
// -----------------------------------------------------
function calculateContextHealth(totalChars: number): ContextHealth {
  if (totalChars < HEALTH_THRESHOLDS.fresh) return "fresh";
  if (totalChars < HEALTH_THRESHOLDS.dense) return "dense";
  return "saturated";
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

    const message = sanitizeASCII(String(body.message));

    const {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? "user:anonymous";

    const cookieHeader = req.headers.get("cookie") ?? "";
    const sessionId =
      cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("solace-session="))
        ?.split("=")[1] ?? null;

    // -------------------------------------------------
    // Working Memory — Explicit Command
    // -------------------------------------------------
    const normalized = message.trim().toLowerCase();
    const wmPrefix =
      normalized.startsWith("save to working memory ") ||
      normalized.startsWith("put in working memory ") ||
      normalized.startsWith("keep this for this session ");

    if (wmPrefix && sessionId) {
      const content = message
        .replace(/^save to working memory\s+/i, "")
        .replace(/^put in working memory\s+/i, "")
        .replace(/^keep this for this session\s+/i, "")
        .trim();

      if (content.length > 0) {
        addWorkingMemoryItem(sessionId, {
          id: crypto.randomUUID(),
          content,
          scope: "project",
          sensitivity: "medium",
        });
      }
    }

    // -------------------------------------------------
    // Context Assembly
    // -------------------------------------------------
    let context = await assembleContext(
      canonicalUserKey,
      workspaceId,
      message
    );
    context = sanitizeASCII(context);

    // -------------------------------------------------
    // Context Health Computation
    // -------------------------------------------------
    const totalChars =
      message.length +
      JSON.stringify(history).length +
      JSON.stringify(context).length;

    const contextHealth = calculateContextHealth(totalChars);

    // -------------------------------------------------
    // Governor + Hybrid Triad
    // -------------------------------------------------
    const gov = updateGovernor(message);

    const pipeline = await runHybridPipeline({
      userMessage: message,
      context,
      history,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey,
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
    // Long-Term Memory Gate (unchanged)
    // -------------------------------------------------
    const explicitRemember =
      normalized.startsWith("remember ") ||
      normalized.startsWith("remember that ");

    if (user?.id && user.email && (explicitRemember || founderMode === true)) {
      const memoryInput: MemoryWriteInput = {
        userId: user.id,
        email: user.email,
        workspaceId,
        memoryType: explicitRemember ? "fact" : "identity",
        source: explicitRemember ? "explicit" : "founder",
        content: message,
      };

      await writeMemory(memoryInput, cookieHeader);
    }

    return NextResponse.json({
      text: formatted,
      imageUrl: pipeline.imageUrl ?? null,
      contextHealth,
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE FATAL]", err);
    return NextResponse.json(
      { error: err?.message ?? "ChatRouteError", text: "[error]" },
      { status: 500 }
    );
  }
}

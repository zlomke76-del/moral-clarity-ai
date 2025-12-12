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
// ASCII Sanitize (defensive, Node-safe)
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
// Supabase session loader (Node-safe, no middleware)
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

    // -------------------------------------------------
    // Context (READ-ONLY MEMORY RECALL)
    // -------------------------------------------------
    let context = await assembleContext(
      canonicalUserKey,
      workspaceId,
      message
    );
    context = sanitizeASCII(context);

    // -------------------------------------------------
    // Governor + Hybrid Triad (Opt / Skeptic / Arb)
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
    // MEMORY WRITE GATE — EXPLICIT ONLY
    // -------------------------------------------------
    const normalized = message.trim().toLowerCase();
    const explicitRemember =
      normalized.startsWith("remember ") ||
      normalized.startsWith("remember that ");

    if (user?.id && user.email && (explicitRemember || founderMode === true)) {
      console.log("[MEMORY-GATE] write allowed", {
        explicitRemember,
        founderMode,
        userId: user.id,
      });

      const memoryInput: MemoryWriteInput = {
        userId: user.id,
        email: user.email,
        workspaceId,
        memoryType: explicitRemember ? "fact" : "identity",
        source: explicitRemember ? "explicit" : "founder",
        content: message,
      };

      await writeMemory(memoryInput, cookieHeader);
    } else {
      console.log("[MEMORY-GATE] write skipped");
    }

    return NextResponse.json({
      text: formatted,
      imageUrl: pipeline.imageUrl ?? null,
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE FATAL]", err);
    return NextResponse.json(
      { error: err?.message ?? "ChatRouteError", text: "[error]" },
      { status: 500 }
    );
  }
}

// app/api/chat/route.ts
// -------------------------------------------------------------
// Solace Chat Route — with canonical identity (email-based),
// full memory integration, hybrid pipeline, ministry/founder,
// and correct system block assembly.
// -------------------------------------------------------------

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";

import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt, buildSystemBlock } from "./modules/assemble";
import { runHybridPipeline } from "./modules/orchestrator";
import { writeMemory } from "./modules/memory-writer";

import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

/**
 * Map modeHint → Solace domain
 */
function mapModeHintToDomain(modeHint: string): string {
  switch (modeHint) {
    case "Create":
      return "optimist";
    case "Red Team":
      return "skeptic";
    case "Next Steps":
      return "arbiter";
    default:
      return "guidance"; // Neutral mode
  }
}

/**
 * POST — Chat Handler
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      history = [],
      workspaceId = null,

      // from SolaceDock UI
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    //--------------------------
    // 1. Resolve canonical identity
    //--------------------------
    const authIdentity = await getCanonicalUserKey();
    const canonicalKey = authIdentity.canonicalKey; // ALWAYS email or "guest"

    //--------------------------
    // 2. Load memory + context
    //--------------------------
    const context = await assembleContext(
      canonicalKey,
      workspaceId,
      message
    );

    //--------------------------
    // 3. Determine model domain
    //--------------------------
    let domain = mapModeHintToDomain(modeHint);

    if (founderMode) {
      domain = "founder";
    } else if (ministryMode) {
      domain = "ministry";
    }

    const extras = ministryMode
      ? "Ministry mode active — apply Scripture sparingly when relevant."
      : "";

    //--------------------------
    // 4. SYSTEM + USER BLOCKS
    //--------------------------
    const systemBlock = buildSystemBlock(domain, extras);
    const userBlocks = assemblePrompt(context, history, message);
    const fullBlocks = [systemBlock, ...userBlocks];

    //--------------------------
    // 5. HYBRID PIPELINE or NEUTRAL
    //--------------------------
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    let finalText = "";

    if (hybridAllowed) {
      const { finalAnswer } = await runHybridPipeline({
        userMessage: message,
        context,
        history,
        ministryMode,
        modeHint,
        founderMode,
        canonicalUserKey: canonicalKey, // NEW
      });

      finalText = finalAnswer || "[No arbiter answer]";
    } else {
      // ----- NEUTRAL SINGLE-MODEL -----
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          input: fullBlocks,
        }),
      });

      const json = await res.json();
      finalText =
        json?.output?.[0]?.content?.[0]?.text ?? "[No reply]";
    }

    //--------------------------
    // 6. Memory write AFTER final answer
    //--------------------------
    try {
      await writeMemory(
        canonicalKey,   // ALWAYS email
        message,
        finalText
      );
    } catch (err) {
      console.error("[memory-write] failed", err);
    }

    //--------------------------
    // 7. Return answer
    //--------------------------
    return NextResponse.json({ text: finalText });
  } catch (err: any) {
    console.error("[chat route] fatal:", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}


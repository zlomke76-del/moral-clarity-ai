// app/api/chat/route.ts
// -------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Hybrid Pipeline (Optimist → Skeptic → Arbiter) OR Neutral Mode
// Domain selection: Create / Red Team / Next Steps / Neutral
// Ministry + Founder modes supported
// -------------------------------------------------------------

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runHybridPipeline } from "./modules/orchestrator";
import { writeMemory } from "./modules/memory-writer";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * Mode → Solace domain mapping
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
      return "guidance";
  }
}

/**
 * Chat Handler
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      history = [],
      userKey = "guest",
      workspaceId = null,

      // NEW: UI toggles from SolaceDock
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 1) MEMORY + PERSONA CONTEXT
    const context = await assembleContext(userKey, workspaceId, message);

    // Determine intended domain
    let domain = mapModeHintToDomain(modeHint);

    // Founder overrides everything
    if (founderMode) {
      domain = "founder";
    } else if (ministryMode) {
      domain = "ministry";
    }

    const extras = ministryMode
      ? "Ministry mode active — apply Scripture sparingly when relevant."
      : "";

    // Build full Solace system persona block
    const systemText = buildSolaceSystemPrompt(domain as any, extras);
    const systemBlock = {
      role: "system",
      content: [
        {
          type: "input_text",
          text: systemText,
        },
      ],
    };

    // USER block from assemble.ts
    const userBlocks = assemblePrompt(context, history, message);

    const fullBlocks = [systemBlock, ...userBlocks];

    // 2) HYBRID SUPER-AI PIPELINE
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    let finalText: string;

    if (hybridAllowed) {
      const { finalAnswer } = await runHybridPipeline({
        userMessage: message,
        context,
        history,
        ministryMode,
        modeHint,
        founderMode,
      });

      finalText = finalAnswer || "[No arbiter answer]";
    } else {
      // 3) NEUTRAL MODE — single-model inference
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
      const block = json.output?.[0]?.content?.[0];
      finalText = block?.text ?? "[No reply]";
    }

    // 4) MEMORY WRITE (AFTER arbiter result or neutral reply)
    try {
      await writeMemory(userKey, message, finalText);
    } catch (err) {
      console.error("[memory-writer] failed:", err);
    }

    return NextResponse.json({ text: finalText });
  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}


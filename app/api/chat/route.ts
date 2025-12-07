// app/api/chat/route.ts

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runHybridPipeline } from "./modules/orchestrator";
import { writeMemory } from "./modules/memory-writer";

/**
 * POST /api/chat
 * Unified routing for:
 * - Neutral mode (single-model)
 * - Hybrid Super-AI mode (Optimist → Skeptic → Arbiter)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      history = [],
      userKey = "guest",
      workspaceId = null,

      // UI toggles from SolaceDock
      ministryMode = false,
      modeHint = "Neutral", // Create | Red Team | Next Steps | Neutral
      founderMode = false   // New — Super-AI authority toggle
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // -------------------------------------------------------------------
    // 1. Load all context: persona, memory, news, research
    // -------------------------------------------------------------------
    const context = await assembleContext(userKey, workspaceId, message);

    // -------------------------------------------------------------------
    // 2. Select pipeline
    // -------------------------------------------------------------------
    const useHybrid =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps";

    let finalText: string;

    if (useHybrid) {
      // ---------------------------------------------------------------
      // SUPER-AI TRI-AGENT PIPELINE
      // ---------------------------------------------------------------
      const result = await runHybridPipeline({
        userMessage: message,
        context,
        history,
        ministryMode,
        modeHint,
        founderMode
      });

      finalText = result?.finalAnswer || "[No arbiter answer]";
    } else {
      // ---------------------------------------------------------------
      // NEUTRAL SINGLE-MODEL PIPELINE
      // ---------------------------------------------------------------
      const inputBlocks = assemblePrompt(context, history, message);

      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          input: inputBlocks
        })
      });

      const j = await res.json();
      const block = j.output?.[0]?.content?.[0];
      finalText = block?.text ?? "[No reply]";
    }

    // -------------------------------------------------------------------
    // 3. MEMORY WRITE (ground truth = final generated text)
    // -------------------------------------------------------------------
    try {
      await writeMemory(userKey, message, finalText);
    } catch (err) {
      console.error("[memory-writer] failed:", err);
      // Non-fatal — memory write is best-effort
    }

    // -------------------------------------------------------------------
    // 4. Return response
    // -------------------------------------------------------------------
    return NextResponse.json({ text: finalText });

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}

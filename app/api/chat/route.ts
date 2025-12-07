// app/api/chat/route.ts
// -------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Hybrid Pipeline (Optimist → Skeptic → Arbiter) OR Neutral Mode
// Memory, Persona, and Domain Logic integrated
// Email is single source of truth for user identity
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
import { getEdgeUser } from "@/lib/supabase/edge-user";

// -------------------------------------------------------------
// Mode → Solace Domain Mapping
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// POST Handler
// -------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      history = [],
      workspaceId = null,

      // UI toggles from SolaceDock
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 1) AUTH — Identify user via email (canonical identity)
    // ---------------------------------------------------------
    const edgeUser = await getEdgeUser(req);
    const userKey = edgeUser?.email ?? "guest";

    // ---------------------------------------------------------
    // 2) CONTEXT — Memory, Persona, News, Research
    // ---------------------------------------------------------
    const context = await assembleContext(userKey, workspaceId, message);

    // Determine domain based on UI mode
    let domain = mapModeHintToDomain(modeHint);

    // Founder overrides everything
    if (founderMode) {
      domain = "founder";
    } else if (ministryMode) {
      domain = "ministry";
    }

    // Build user prompt blocks (system prompt added later)
    const userBlocks = assemblePrompt(context, history, message);

    // ---------------------------------------------------------
    // 3) HYBRID SUPER-AI PIPELINE
    // ---------------------------------------------------------
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
        userKey, // ensures memory continuity across pipeline
      });

      finalText = finalAnswer || "[No arbiter answer]";
    } else {
      // ---------------------------------------------------------
      // 4) Neutral Mode — single-model prompt
      // ---------------------------------------------------------
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          input: userBlocks,
        }),
      });

      const json = await res.json();
      const block = json.output?.[0]?.content?.[0];
      finalText = block?.text ?? "[No reply]";
    }

    // ---------------------------------------------------------
    // 5) MEMORY WRITE (AFTER successful response)
    // ---------------------------------------------------------
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
      { status: 500 },
    );
  }
}


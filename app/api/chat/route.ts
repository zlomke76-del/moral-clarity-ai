// app/api/chat/route.ts
// -------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Unified Memory • Hybrid Pipeline
// -------------------------------------------------------------

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt, buildSystemBlock } from "./modules/assemble";
import { orchestrateSolaceResponse } from "./modules/orchestrator";
import { writeMemory } from "./modules/memory-writer";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

// Mode → Solace Domain
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
// POST handler
// -------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      history = [],
      workspaceId = null,

      // From SolaceDock UI
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      overrideUserKey = null,
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // -------------------------------------------------------------
    // AUTH / CANONICAL USER
    // -------------------------------------------------------------
    const auth = await getCanonicalUserKey(req);
    const canonicalUserKey = overrideUserKey || auth?.canonicalKey || "guest";

    // -------------------------------------------------------------
    // CONTEXT (memory, persona, news, research…)
    // -------------------------------------------------------------
    const context = await assembleContext({
      overrideUserKey: canonicalUserKey,
      workspaceId,
      userMessage: message,
    });

    // -------------------------------------------------------------
    // SYSTEM PROMPT (Persona + Domain)
    // -------------------------------------------------------------
    let domain = mapModeHintToDomain(modeHint);

    // Founder overrides all
    if (founderMode) domain = "founder";
    else if (ministryMode) domain = "ministry";

    const extras = ministryMode
      ? "Ministry mode active — Scripture allowed sparingly and only when relevant."
      : "";

    const systemBlock = buildSystemBlock(domain, extras);

    const userBlocks = assemblePrompt(context, history, message);
    const fullPrompt = [systemBlock, ...userBlocks];

    // -------------------------------------------------------------
    // HYBRID PIPELINE DECISION
    // -------------------------------------------------------------
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    let finalText: string;

    if (hybridAllowed) {
      // Use orchestrator wrapper (handles canonicalUserKey)
      finalText = await orchestrateSolaceResponse({
        message,
        context,
        history,
        ministryMode,
        modeHint,
        founderMode,
        canonicalUserKey,
      });
    } else {
      // NEUTRAL MODE → Single-model run (gpt-4.1)
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          input: fullPrompt,
        }),
      });

      const json = await res.json();
      const block = json.output?.[0]?.content?.[0];
      finalText = block?.text ?? "[No reply]";
    }

    // -------------------------------------------------------------
    // MEMORY WRITE (after Arbiter or Neutral response)
    // -------------------------------------------------------------
    try {
      await writeMemory(canonicalUserKey, message, finalText);
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



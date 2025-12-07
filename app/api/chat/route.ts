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
import { assemblePrompt, buildSystemBlock } from "./modules/assemble";
import { runHybridPipeline } from "./modules/orchestrator";
import { writeMemory } from "./modules/memory-writer";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

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
      userKey: userKeyOverride = null,
      workspaceId = null,

      // toggles from SolaceDock
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // -------------------------------------------------------------
    // 1) Resolve canonical user identity
    // -------------------------------------------------------------
    const { canonicalKey } = await getCanonicalUserKey(req);

    // override only when explicitly provided
    const finalUserKey = userKeyOverride || canonicalKey || "guest";

    // -------------------------------------------------------------
    // 2) MEMORY + PERSONA CONTEXT (assembleContext expects final userKey)
    // -------------------------------------------------------------
    const context = await assembleContext(finalUserKey, workspaceId, message);

    // -------------------------------------------------------------
    // 3) Determine Solace domain
    // -------------------------------------------------------------
    let domain = mapModeHintToDomain(modeHint);

    if (founderMode) {
      domain = "founder";
    } else if (ministryMode) {
      domain = "ministry";
    }

    const extras = ministryMode
      ? "Ministry mode active — apply Scripture sparingly when relevant."
      : "";

    // SYSTEM persona block (Solace identity + Abrahamic Code)
    const systemBlock = buildSystemBlock(domain, extras);

    // USER prompt blocks (facts + episodes + news + research + message)
    const userBlocks = assemblePrompt(context, history, message);

    const fullBlocks = [systemBlock, ...userBlocks];

    // -------------------------------------------------------------
    // 4) HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
    // -------------------------------------------------------------
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
      // -------------------------------------------------------------
      // 5) NEUTRAL MODE — direct single-model inference
      // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // 6) MEMORY WRITE (AFTER arbiter result or neutral reply)
    // -------------------------------------------------------------
    try {
      await writeMemory(finalUserKey, message, finalText);
    } catch (err) {
      console.error("[memory-writer] failed:", err);
    }

    // -------------------------------------------------------------
    // 7) RETURN REPLY
    // -------------------------------------------------------------
    return NextResponse.json({ text: finalText });

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}



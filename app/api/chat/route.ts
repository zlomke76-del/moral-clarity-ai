//---------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Unified Memory + Founder Mode + Ministry Mode
// Hybrid pipeline now lives in orchestrator.ts (orchestrateSolaceResponse)
//---------------------------------------------------------------

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
      userKey = null,
      workspaceId = null,

      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 🔑 Always use canonical user identity — MUST PASS req
    const { canonicalKey } = await getCanonicalUserKey(req);
    const effectiveUserKey = userKey || canonicalKey || "guest";

    // 1) MEMORY + PERSONA CONTEXT
    const context = await assembleContext(effectiveUserKey, workspaceId, message);

    // Determine intended domain
    let domain = mapModeHintToDomain(modeHint);

    if (founderMode) {
      domain = "founder";
    } else if (ministryMode) {
      domain = "ministry";
    }

    const extras = ministryMode
      ? "Ministry mode active — apply Scripture sparingly when relevant."
      : "";

    // System block ALWAYS applied
    const systemBlock = buildSystemBlock(domain, extras);
    const userBlocks = assemblePrompt(context, history, message);
    const fullBlocks = [systemBlock, ...userBlocks];

    // Determine if hybrid pipeline is allowed
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    let finalText: string;

    if (hybridAllowed) {
      // ---------------------------------------------------------
      // NEW: Unified Hybrid Pipeline Entry Point
      // ---------------------------------------------------------
      const finalAnswer = await orchestrateSolaceResponse({
        userMessage: message,
        context,
        history,
        ministryMode,
        modeHint,
        founderMode,
        canonicalUserKey: effectiveUserKey,
      });

      finalText = finalAnswer || "[No arbiter answer]";
    } else {
      // Neutral mode — single model call
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

    // MEMORY WRITE — only after final answer
    try {
      await writeMemory(effectiveUserKey, message, finalText);
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



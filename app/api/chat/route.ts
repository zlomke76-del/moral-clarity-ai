// app/api/chat/route.ts
//---------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Unified Memory + Founder Mode + Ministry Mode
// Hybrid pipeline lives in orchestrator.ts (orchestrateSolaceResponse)
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
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      // NOTE: userKey from body is intentionally IGNORED for identity.
      // All canonical identity comes from Supabase auth.
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 🔑 Always use canonical user identity from Supabase (email)
    const { canonicalKey } = await getCanonicalUserKey(req);
    const canonicalUserKey: string | null = canonicalKey ?? null;

    // For context reads we can safely fall back to "guest"
    const contextKey = canonicalUserKey || "guest";

    // 1) MEMORY + PERSONA CONTEXT
    const context = await assembleContext(contextKey, workspaceId, message);

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
      // HYBRID PIPELINE ENTRY POINT
      // ---------------------------------------------------------
      const finalAnswer = await orchestrateSolaceResponse({
        userMessage: message,
        context,
        history,
        ministryMode,
        modeHint,
        founderMode,
        canonicalUserKey,
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
    // Uses canonicalUserKey (email). If null → writeMemory no-ops.
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




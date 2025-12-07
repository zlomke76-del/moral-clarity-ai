// app/api/chat/route.ts
// -------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Hybrid Pipeline (Optimist → Skeptic → Arbiter) OR Neutral Mode
// Canonical user identity via Supabase auth
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

// NEW — canonical identity
import { getCanonicalUserKey } from "@/lib/supabase/edge-auth";

// -------------------------------------------------------------
// Mode → Domain mapping
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
// POST handler
// -------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      history = [],
      workspaceId = null,

      // from UI toggles
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 1) Resolve canonical identity (email or "guest")
    // ---------------------------------------------------------
    const userKey = await getCanonicalUserKey(req);

    // ---------------------------------------------------------
    // 2) Load upstream memory + persona context
    // ---------------------------------------------------------
    const context = await assembleContext(userKey, workspaceId, message);

    // Domain determination
    let domain = mapModeHintToDomain(modeHint);

    if (founderMode) {
      domain = "founder";
    } else if (ministryMode) {
      domain = "ministry";
    }

    const extras = ministryMode
      ? "Ministry mode active — integrate Scripture sparingly when relevant."
      : "";

    // System block
    const systemBlock = buildSystemBlock(domain, extras);
    const userBlocks = assemblePrompt(context, history, message);
    const fullBlocks = [systemBlock, ...userBlocks];

    // ---------------------------------------------------------
    // 3) Hybrid pipeline OR single-model inference
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
        userKey, // NEW — ensure subpipelines use correct user identity
      });

      finalText = finalAnswer || "[No arbiter answer]";
    } else {
      // Neutral single-model execution
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

    // ---------------------------------------------------------
    // 4) Memory write (final pipeline output only)
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
      { status: 500 }
    );
  }
}



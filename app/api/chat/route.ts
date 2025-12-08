//---------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Edge Runtime • Safe Session Retrieval • Memory Pipeline
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

import { createClient } from "@supabase/supabase-js";

// -------------------------------------------------------------
// Edge-safe Supabase user extractor (no cookies(), no headers())
// -------------------------------------------------------------
async function getEdgeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  // Extract Supabase auth cookie (single token)
  const token = cookieHeader
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("sb-"))
    ?.split("=")[1];

  if (!token) return null;

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

  const { data, error } = await sb.auth.getUser();
  if (error || !data?.user) return null;

  return data.user;
}

// -------------------------------------------------------------
// Mode → Solace domain mapping
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
// POST /api/chat
// -------------------------------------------------------------
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
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // ---------------------------------------------------------
    // USER SESSION (Edge-safe version)
    // ---------------------------------------------------------
    const user = await getEdgeUser(req);
    const canonicalUserKey = user?.id ?? null;
    const contextKey = canonicalUserKey || "guest";

    // ---------------------------------------------------------
    // MEMORY + PERSONA CONTEXT
    // ---------------------------------------------------------
    const context = await assembleContext(contextKey, workspaceId, message);

    // Select domain
    let domain = mapModeHintToDomain(modeHint);
    if (founderMode) domain = "founder";
    else if (ministryMode) domain = "ministry";

    const extras = ministryMode
      ? "Ministry mode active — apply Scripture sparingly when relevant."
      : "";

    const systemBlock = buildSystemBlock(domain, extras);
    const userBlocks = assemblePrompt(context, history, message);
    const fullBlocks = [systemBlock, ...userBlocks];

    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    let finalText: string;

    // ---------------------------------------------------------
    // HYBRID PIPELINE
    // ---------------------------------------------------------
    if (hybridAllowed) {
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
      // ---------------------------------------------------------
      // Neutral → Single-model pipeline
      // ---------------------------------------------------------
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
      finalText = json?.output?.[0]?.content?.[0]?.text ?? "[No reply]";
    }

    // ---------------------------------------------------------
    // MEMORY WRITE (safe, non-blocking)
    // ---------------------------------------------------------
    try {
      await writeMemory(canonicalUserKey, message, finalText);
    } catch (err) {
      console.error("[memory-writer] failed:", err);
    }

    return NextResponse.json({ text: finalText });
  } catch (err: any) {
    console.error("[chat route] fatal", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}



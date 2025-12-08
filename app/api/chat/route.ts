//---------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Edge Runtime • Magic-Link Safe Session Retrieval • Memory Pipeline
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

import { createServerClient } from "@supabase/ssr";

// -------------------------------------------------------------
// MAGIC-LINK-SAFE USER SESSION EXTRACTOR (SSR + Edge compatible)
// -------------------------------------------------------------
async function getEdgeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  // Use Supabase SSR client — the ONLY correct decoder for the sb-*-auth-token bundle
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const match = cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(`${name}=`));

          return match ? match.split("=")[1] : undefined;
        },
        set() {},    // Edge runtime: no-op
        remove() {}, // Edge runtime: no-op
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
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
    // USER SESSION (Magic-link compatible)
    // ---------------------------------------------------------
    const user = await getEdgeUser(req);
    const canonicalUserKey = user?.id ?? null;
    const contextKey = canonicalUserKey || "guest";

    // ---------------------------------------------------------
    // MEMORY + PERSONA CONTEXT
    // ---------------------------------------------------------
    const context = await assembleContext(contextKey, workspaceId, message);

    // Select Solace persona domain
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
    // HYBRID PIPELINE (Founder, Create, Red Team, Next Steps)
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
    // MEMORY WRITE — safe, non-blocking
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

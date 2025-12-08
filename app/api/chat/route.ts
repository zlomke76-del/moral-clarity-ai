//---------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Edge Runtime • Magic-link SAFE • Full DIAG Instrumentation
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
// MAGIC-LINK SAFE SESSION LOADER  (sb- cookies preserved)
// -------------------------------------------------------------
async function getEdgeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  console.log("[DIAG-A1] Incoming cookie header:", cookieHeader);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const match = cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(`${name}=`));

          const value = match ? match.split("=")[1] : undefined;

          console.log(`[DIAG-A2] Cookie get(${name}) →`, value?.slice(0, 14));
          return value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log("[DIAG-A3] getUser ERROR:", error.message);
    return null;
  }

  console.log("[DIAG-A4] getUser SUCCESS — user id:", data?.user?.id);
  return data?.user ?? null;
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
// OPENAI RETRY WRAPPER (fully instrumented)
// -------------------------------------------------------------
async function callOpenAIWithRetry(blocks: any[]): Promise<string> {
  const payload = {
    model: "gpt-4.1",
    input: blocks,
  };

  console.log("[DIAG-O1] Calling OpenAI with blocks:", JSON.stringify(blocks).slice(0, 600));

  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    // RATE LIMIT
    if (res.status === 429) {
      const wait = attempt * 350;
      console.warn(`[OPENAI] 429 rate limit — retrying in ${wait}ms (attempt ${attempt}/4)`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    // OTHER ERROR
    if (!res.ok) {
      console.error("[OPENAI] Fatal error:", res.status, await res.text());
      return "[No reply]";
    }

    const json = await res.json();
    console.log("[DIAG-O2] OpenAI response received");

    return json?.output?.[0]?.content?.[0]?.text ?? "[No reply]";
  }

  console.error("[OPENAI] Exhausted retries — using fail-safe.");
  return "[No reply]";
}

// -------------------------------------------------------------
// POST /api/chat
// -------------------------------------------------------------
export async function POST(req: Request) {
  try {
    // ---------------------------------------------------------
    // RAW REQUEST BODY DIAG
    // ---------------------------------------------------------
    let body;
    try {
      body = await req.json();
      console.log("[DIAG-B0] Raw request body:", JSON.stringify(body).slice(0, 500));
    } catch (err) {
      console.error("[DIAG-B0] Failed to parse req.json()", err);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const {
      message,
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
    } = body;

    if (!message || typeof message !== "string") {
      console.error("[DIAG-B1] Missing message in request");
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // ---------------------------------------------------------
    // USER SESSION (Magic Link Safe)
    // ---------------------------------------------------------
    const user = await getEdgeUser(req);
    const canonicalUserKey = user?.id ?? null;

    console.log("[DIAG-B2] canonicalUserKey:", canonicalUserKey);

    const contextKey = canonicalUserKey || "guest";

    console.log("[Solace Context] Load with canonical key:", {
      canonicalUserKey: contextKey,
      workspaceId,
    });

    // ---------------------------------------------------------
    // MEMORY + CONTEXT LOAD
    // ---------------------------------------------------------
    const context = await assembleContext(contextKey, workspaceId, message);

    console.log("[DIAG-C1] Context loaded — keys:", Object.keys(context));

    // ---------------------------------------------------------
    // BUILD PROMPT BLOCKS
    // ---------------------------------------------------------
    const systemBlock = buildSystemBlock(mapModeHintToDomain(modeHint), "");
    const userBlocks = assemblePrompt(context, history, message);
    const fullBlocks = [systemBlock, ...userBlocks];

    console.log("[DIAG-P1] systemBlock:", JSON.stringify(systemBlock).slice(0, 400));
    console.log("[DIAG-P2] userBlocks count:", userBlocks.length);
    console.log("[DIAG-P3] fullBlocks length:", fullBlocks.length);

    if (fullBlocks.length === 0) {
      console.error("[DIAG-P4] ERROR — Prompt assembly produced ZERO blocks.");
      return NextResponse.json({ text: "[Prompt error — no blocks]" });
    }

    let finalText: string;

    // ---------------------------------------------------------
    // HYBRID PIPELINE (Arbiter / Founder / Create / Red Team)
    // ---------------------------------------------------------
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    if (hybridAllowed) {
      console.log("[DIAG-H1] Hybrid pipeline active");

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
      // NEUTRAL PATH — Single-model + Retry Logic
      // ---------------------------------------------------------
      console.log("[DIAG-N1] Neutral pipeline active");
      finalText = await callOpenAIWithRetry(fullBlocks);
    }

    console.log("[DIAG-R1] Final answer:", finalText.slice(0, 200));

    // ---------------------------------------------------------
    // MEMORY WRITE
    // ---------------------------------------------------------
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



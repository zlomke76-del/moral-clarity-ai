//---------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Edge Runtime • Magic-link SAFE • Retry Logic Added
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
// MAGIC-LINK SAFE SESSION LOADER (works with sb- cookies)
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
            .find((c) => c.startsWith(name + "="));

          const value = match ? match.split("=")[1] : undefined;

          console.log(`[DIAG-A2] Cookie get(${name}) →`, value?.slice(0, 12));
          return value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.log("[DIAG-A3] Supabase getUser error:", error.message);
    return null;
  }

  console.log("[DIAG-A4] Supabase user:", data?.user?.id);
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
// OPENAI RETRY WRAPPER — fixes silent "[No reply]" issue
// -------------------------------------------------------------
async function callOpenAIWithRetry(blocks: any[]): Promise<string> {
  const payload = {
    model: "gpt-4.1",
    input: blocks,
  };

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
    return json?.output?.[0]?.content?.[0]?.text ?? "[No reply]";
  }

  // All retries failed:
  console.error("[OPENAI] Exhausted retries — using fail-safe.");
  return "[No reply]";
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
    // USER SESSION (Magic Link Safe)
    // ---------------------------------------------------------
    const user = await getEdgeUser(req);
    const canonicalUserKey = user?.id ?? null;
    const contextKey = canonicalUserKey || "guest";

    console.log("[Solace Context] Load with canonical key:", {
      canonicalUserKey: contextKey,
      workspaceId,
    });

    // ---------------------------------------------------------
    // MEMORY + PERSONA CONTEXT
    // ---------------------------------------------------------
    const context = await assembleContext(contextKey, workspaceId, message);

    // ---------------------------------------------------------
    // Select Solace Domain
    // ---------------------------------------------------------
    let domain = mapModeHintToDomain(modeHint);
    if (founderMode) domain = "founder";
    else if (ministryMode) domain = "ministry";

    const extras = ministryMode
      ? "Ministry mode active — apply Scripture sparingly when relevant."
      : "";

    const systemBlock = buildSystemBlock(domain, extras);
    const userBlocks = assemblePrompt(context, history, message);
    const fullBlocks = [systemBlock, ...userBlocks];

    let finalText: string;

    // ---------------------------------------------------------
    // HYBRID PIPELINE
    // ---------------------------------------------------------
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

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
      // NEUTRAL → SINGLE-MODEL PIPELINE w/ retry logic
      // ---------------------------------------------------------
      finalText = await callOpenAIWithRetry(fullBlocks);
    }

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


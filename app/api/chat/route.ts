// app/api/chat/route.ts
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
// MAGIC-LINK SAFE SESSION LOADER
// -------------------------------------------------------------
async function getEdgeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  console.log("[DIAG-A1] Incoming cookie header:", cookieHeader);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const raw = cookieHeader
            .split(";")
            .map((x) => x.trim())
            .find((x) => x.startsWith(name + "="));
          const v = raw ? raw.split("=")[1] : undefined;
          console.log(`[DIAG-A2] Cookie get(${name}) →`, v?.slice(0, 14));
          return v;
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
// FIXED OPENAI CALL — gpt-4.1-mini
// -------------------------------------------------------------
async function callOpenAIWithRetry(blocks: any[]): Promise<string> {
  const payload = {
    model: "gpt-4.1-mini",
    input: blocks,
  };

  console.log(
    "[DIAG-O1] Calling OpenAI with blocks:",
    JSON.stringify(blocks).slice(0, 600)
  );

  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) {
      const wait = attempt * 350;
      console.warn(
        `[OPENAI] 429 rate limit — retrying in ${wait}ms (attempt ${attempt}/4)`
      );
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    if (!res.ok) {
      console.error("[OPENAI] Fatal error:", res.status, await res.text());
      return "[No reply]";
    }

    const json = await res.json();
    console.log("[DIAG-O2] OpenAI response received");

    // Flexible response parser — WORKS FOR ALL BLOCK SHAPES
    let out = "";

    try {
      const o = json?.output?.[0];

      if (!o) return "[No reply]";

      if (typeof o.content === "string") {
        out = o.content;
      } else if (Array.isArray(o.content)) {
        // Handle block content arrays
        out =
          o.content
            .map((c: any) => c?.text || c?.content || "")
            .join(" ")
            .trim() || "";
      } else {
        out = JSON.stringify(o);
      }
    } catch (err) {
      console.error("[DIAG-O3] Parse error:", err);
      return "[No reply]";
    }

    return out || "[No reply]";
  }

  console.error("[OPENAI] Exhausted retries — fail-safe.");
  return "[No reply]";
}

// -------------------------------------------------------------
// POST /api/chat
// -------------------------------------------------------------
export async function POST(req: Request) {
  try {
    // Raw body
    let body;
    try {
      body = await req.json();
      console.log(
        "[DIAG-B0] Raw request body:",
        JSON.stringify(body).slice(0, 500)
      );
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

    // User session
    const user = await getEdgeUser(req);
    const canonicalUserKey = user?.id ?? null;

    console.log("[DIAG-B2] canonicalUserKey:", canonicalUserKey);

    const contextKey = canonicalUserKey || "guest";

    console.log("[Solace Context] Load key:", {
      contextKey,
      workspaceId,
    });

    // Context load
    const context = await assembleContext(contextKey, workspaceId, message);
    console.log("[DIAG-C1] Context loaded — keys:", Object.keys(context));

    // Prompt blocks
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

    // Hybrid pipeline
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    if (hybridAllowed) {
      console.log("[DIAG-H1] Hybrid pipeline active");

      finalText =
        (await orchestrateSolaceResponse({
          userMessage: message,
          context,
          history,
          ministryMode,
          modeHint,
          founderMode,
          canonicalUserKey,
        })) || "[No reply]";
    } else {
      console.log("[DIAG-N1] Neutral pipeline active");
      finalText = await callOpenAIWithRetry(fullBlocks);
    }

    console.log("[DIAG-R1] Final answer:", finalText.slice(0, 200));

    // Memory storage
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



//--------------------------------------------------------------
// SOLACE CHAT ROUTE — NODE RUNTIME (STABLE)
// Fully ASCII-sanitized to avoid ByteString Unicode errors
//--------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt, buildSystemBlock } from "./modules/assemble";
import { orchestrateSolaceResponse } from "./modules/orchestrator";
import { writeMemory } from "./modules/memory-writer";

//--------------------------------------------------------------
// UNIVERSAL ASCII SANITIZER — FIXES ALL BYTESTRING ERRORS
//--------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const replacements: Record<string, string> = {
    "—": "-", // em dash
    "–": "-", // en dash
    "•": "*",
    "“": "\"",
    "”": "\"",
    "‘": "'",
    "’": "'",
    "…": "...",
  };

  let out = input;

  for (const bad of Object.keys(replacements)) {
    out = out.split(bad).join(replacements[bad]);
  }

  // Last protection: convert ANY char >255 to '?'
  out = out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");

  return out;
}

//--------------------------------------------------------------
// UNIVERSAL BLOCK SANITIZER
//--------------------------------------------------------------
function sanitizeBlock(block: any) {
  if (!block) return block;

  // Array-style content
  if (Array.isArray(block.content)) {
    block.content = block.content.map((piece: any) => {
      if (typeof piece === "string") return sanitizeASCII(piece);

      if (piece?.text) piece.text = sanitizeASCII(piece.text);
      if (piece?.input_text) piece.input_text = sanitizeASCII(piece.input_text);
      if (piece?.output_text) piece.output_text = sanitizeASCII(piece.output_text);

      return piece;
    });
  }

  // Direct fields
  if (typeof block.text === "string") block.text = sanitizeASCII(block.text);
  if (typeof block.input_text === "string")
    block.input_text = sanitizeASCII(block.input_text);
  if (typeof block.output_text === "string")
    block.output_text = sanitizeASCII(block.output_text);

  return block;
}

//--------------------------------------------------------------
// LOAD USER SESSION — Node runtime safe version
//--------------------------------------------------------------
async function getNodeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

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

          return match ? match.split("=")[1] : undefined;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data } = await supabase.auth.getUser().catch(() => ({ data: null }));
  return data?.user ?? null;
}

//--------------------------------------------------------------
// OPENAI CALL — SINGLE MODEL + RETRY + SANITIZATION
//--------------------------------------------------------------
async function callOpenAI(fullBlocks: any[]): Promise<string> {
  const safeBlocks = fullBlocks.map((b) =>
    sanitizeBlock(JSON.parse(JSON.stringify(b)))
  );

  const payload = {
    model: "gpt-4.1",
    input: safeBlocks,
  };

  console.log("[OPENAI] Payload (sanitized):", JSON.stringify(payload).slice(0, 350));

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
      const wait = attempt * 400;
      console.warn(`[OPENAI] 429 — retrying in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    if (!res.ok) {
      console.error("[OPENAI] Error:", res.status, await res.text());
      return "[No reply]";
    }

    const json = await res.json();
    return json?.output?.[0]?.content?.[0]?.text ?? "[No reply]";
  }

  return "[No reply]";
}

//--------------------------------------------------------------
// POST /api/chat
//--------------------------------------------------------------
export async function POST(req: Request) {
  const diag: any = { stage: "start" };

  try {
    //----------------------------------------------
    // Parse request
    //----------------------------------------------
    const body = await req.json().catch(() => null);
    diag.body = body;

    if (!body?.message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    // Sanitize user message
    const message = sanitizeASCII(body.message);

    //----------------------------------------------
    // Extract parameters
    //----------------------------------------------
    let {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitClientKey,
    } = body;

    //----------------------------------------------
    // SANITIZE HISTORY — CRITICAL FIX
    //----------------------------------------------
    const cleanHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          ...h,
          content: sanitizeASCII(h.content || ""),
        }))
      : [];

    //----------------------------------------------
    // Resolve user identity
    //----------------------------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";
    diag.user = canonicalUserKey;

    //----------------------------------------------
    // Load Solace context
    //----------------------------------------------
    const context = await assembleContext(
      canonicalUserKey,
      workspaceId,
      message
    );

    //----------------------------------------------
    // Build prompt blocks
    //----------------------------------------------
    const domain =
      modeHint === "Create"
        ? "optimist"
        : modeHint === "Red Team"
        ? "skeptic"
        : modeHint === "Next Steps"
        ? "arbiter"
        : "guidance";

    const systemBlock = sanitizeBlock(buildSystemBlock(domain, ""));

    const userBlocks = assemblePrompt(
      context,
      cleanHistory,
      message
    ).map((b: any) => sanitizeBlock(b));

    const fullBlocks = [systemBlock, ...userBlocks];

    diag.blocks = { userCount: userBlocks.length };

    //----------------------------------------------
    // HYBRID or single-model pipeline
    //----------------------------------------------
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    let finalText = "";

    if (hybridAllowed) {
      finalText =
        (await orchestrateSolaceResponse({
          userMessage: message,
          context,
          history: cleanHistory,
          ministryMode,
          modeHint,
          founderMode,
          canonicalUserKey,
        })) || "[No reply]";
    } else {
      finalText = await callOpenAI(fullBlocks);
    }

    //----------------------------------------------
    // MEMORY WRITE
    //----------------------------------------------
    try {
      await writeMemory(
        canonicalUserKey,
        message,
        sanitizeASCII(finalText)
      );
    } catch (err) {
      console.error("[MEMORY] failed:", err);
    }

    //----------------------------------------------
    // Return response
    //----------------------------------------------
    const res = NextResponse.json({ text: finalText });
    res.headers.set("x-solace-diag", JSON.stringify(diag).slice(0, 1000));
    return res;

  } catch (err: any) {
    console.error("[CHAT ROUTE] fatal", err);

    return NextResponse.json(
      { error: err?.message || "ChatRouteError", diag },
      { status: 500 }
    );
  }
}



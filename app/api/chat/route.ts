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
    "—": "-",   // em dash
    "–": "-",   // en dash
    "•": "*",   // bullets
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
// LOAD USER SESSION (Node runtime version)
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
// OPENAI CALL — SINGLE MODEL + RETRY
//--------------------------------------------------------------
async function callOpenAI(fullBlocks: any[]): Promise<string> {
  // Sanitize EVERYTHING before hitting Responses API
  const safeBlocks = JSON.parse(JSON.stringify(fullBlocks));

  for (const block of safeBlocks) {
    if (block.content) {
      for (const c of block.content) {
        if (c.text) c.text = sanitizeASCII(c.text);
      }
    }
  }

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
      console.warn(`[OPENAI] 429 — retry in ${wait}ms`);
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

    // Sanitize incoming message too
    const message = sanitizeASCII(body.message);

    const {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitClientKey,
    } = body;

    //----------------------------------------------
    // Resolve user identity
    //----------------------------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";
    diag.user = canonicalUserKey;

    //----------------------------------------------
    // Load memory + context
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

    const systemBlock = buildSystemBlock(domain, "");

    // Sanitize system prompt
    if (systemBlock?.content) {
      for (const c of systemBlock.content) {
        if (c.text) c.text = sanitizeASCII(c.text);
      }
    }

    const userBlocks = assemblePrompt(context, history, message).map((b: any) => {
      if (b?.content) {
        for (const c of b.content) {
          if (c.text) c.text = sanitizeASCII(c.text);
        }
      }
      return b;
    });

    const fullBlocks = [systemBlock, ...userBlocks];
    diag.blocks = { userCount: userBlocks.length };

    //----------------------------------------------
    // HYBRID or single-model
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
          history,
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
      await writeMemory(canonicalUserKey, message, finalText);
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



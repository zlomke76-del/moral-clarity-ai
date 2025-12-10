//--------------------------------------------------------------
// SOLACE CHAT ROUTE — NODE RUNTIME (STABLE)
// Fully ASCII-sanitized to eliminate ByteString Unicode errors
//--------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt, buildSystemBlock } from "./modules/assemble";
import { writeMemory } from "./modules/memory-writer";

//--------------------------------------------------------------
// ASCII SANITIZER — replaces all >255 Unicode characters
//--------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const replacements: Record<string, string> = {
    "—": "-", // em dash
    "–": "-", // en dash
    "•": "*",
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "…": "...",
  };

  let out = input;

  for (const bad of Object.keys(replacements)) {
    out = out.split(bad).join(replacements[bad]);
  }

  // Final protection: ANY char >255 becomes '?'
  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

//--------------------------------------------------------------
// BLOCK SANITIZER — deep sanitation for Responses API blocks
//--------------------------------------------------------------
function sanitizeBlock(block: any) {
  if (!block) return block;

  // Array content
  if (Array.isArray(block.content)) {
    block.content = block.content.map((piece: any) => {
      if (typeof piece === "string") return sanitizeASCII(piece);

      if (piece?.text) piece.text = sanitizeASCII(piece.text);
      if (piece?.input_text) piece.input_text = sanitizeASCII(piece.input_text);
      if (piece?.output_text) piece.output_text = sanitizeASCII(piece.output_text);

      return piece;
    });
  }

  // Direct primitives
  if (typeof block.text === "string") block.text = sanitizeASCII(block.text);
  if (typeof block.input_text === "string") {
    block.input_text = sanitizeASCII(block.input_text);
  }
  if (typeof block.output_text === "string") {
    block.output_text = sanitizeASCII(block.output_text);
  }

  return block;
}

//--------------------------------------------------------------
// SESSION LOADER
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
// DIRECT OPENAI CALL — SINGLE MODEL + RETRIES
//--------------------------------------------------------------
async function callOpenAI(fullBlocks: any[]): Promise<string> {
  const safeBlocks = fullBlocks.map((b) =>
    sanitizeBlock(JSON.parse(JSON.stringify(b)))
  );

  const payload = {
    model: "gpt-4.1",
    input: safeBlocks,
  };

  console.log(
    "[OPENAI] Sanitized payload:",
    JSON.stringify(payload).slice(0, 350)
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
    //----------------------------------------------------------
    // Parse request
    //----------------------------------------------------------
    const body = await req.json().catch(() => null);
    diag.rawBodyPresent = !!body;

    if (!body?.message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const rawMessage = String(body.message ?? "");
    const message = sanitizeASCII(rawMessage);
    diag.messagePreview = sanitizeASCII(rawMessage.slice(0, 240));

    //----------------------------------------------------------
    // Extract params
    //----------------------------------------------------------
    let {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitClientKey,
    } = body;

    //----------------------------------------------------------
    // SHALLOW CLEAN
    //----------------------------------------------------------
    const cleanHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          ...h,
          content: h.content,
        }))
      : [];

    //----------------------------------------------------------
    // DEEP SANITIZATION OF HISTORY
    //----------------------------------------------------------
    const sanitizedHistory = cleanHistory.map((h: any) => {
      if (Array.isArray(h.content)) {
        return {
          ...h,
          content: h.content.map((c: any) => {
            if (typeof c === "string") return sanitizeASCII(c);
            if (typeof c?.text === "string") {
              return { ...c, text: sanitizeASCII(c.text) };
            }
            return c;
          }),
        };
      }

      return { ...h, content: sanitizeASCII(h.content || "") };
    });

    diag.historyCount = sanitizedHistory.length;

    //----------------------------------------------------------
    // USER IDENTITY
    //----------------------------------------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";
    diag.user = canonicalUserKey;

    //----------------------------------------------------------
    // CONTEXT LOAD (sanitized)
    //----------------------------------------------------------
    let context = await assembleContext(
      canonicalUserKey,
      workspaceId,
      message
    );

    // Critical: sanitize context to strip any stray Unicode
    context = JSON.parse(sanitizeASCII(JSON.stringify(context)));
    diag.contextLoaded = true;

    //----------------------------------------------------------
    // SYSTEM + USER BLOCKS
    //----------------------------------------------------------
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
      sanitizedHistory,
      message
    ).map((b: any) => sanitizeBlock(b));

    const fullBlocks = [systemBlock, ...userBlocks];
    diag.blocks = { userCount: userBlocks.length };

    //----------------------------------------------------------
    // SINGLE PIPELINE (direct Responses API)
    //----------------------------------------------------------
    const finalText = await callOpenAI(fullBlocks);

    //----------------------------------------------------------
    // MEMORY WRITE
    //----------------------------------------------------------
    try {
      await writeMemory(
        canonicalUserKey,
        message,
        sanitizeASCII(finalText)
      );
      diag.memoryWrite = "ok";
    } catch (err) {
      console.error("[MEMORY] failed:", err);
      diag.memoryWrite = "error";
    }

    //----------------------------------------------------------
    // RETURN (with sanitized diag header)
    //----------------------------------------------------------
    const res = NextResponse.json({ text: finalText });

    const diagHeader = sanitizeASCII(
      JSON.stringify(diag)
    ).slice(0, 1000);

    res.headers.set("x-solace-diag", diagHeader);

    return res;
  } catch (err: any) {
    console.error("[CHAT ROUTE] fatal", err);

    const errDiag = {
      ...diag,
      fatal: sanitizeASCII(err?.message || "ChatRouteError"),
    };

    const res = NextResponse.json(
      { error: err?.message || "ChatRouteError", diag: errDiag },
      { status: 500 }
    );

    const diagHeader = sanitizeASCII(
      JSON.stringify(errDiag)
    ).slice(0, 1000);

    res.headers.set("x-solace-diag", diagHeader);

    return res;
  }
}

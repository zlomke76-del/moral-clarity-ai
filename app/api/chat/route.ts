// --------------------------------------------------------------
// SOLACE CHAT ROUTE — NODE RUNTIME (STABLE)
// Next.js 16 • Supabase SSR • OpenAI Responses API
// --------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt, buildSystemBlock } from "./modules/assemble";
import { orchestrateSolaceResponse } from "./modules/orchestrator";
import { writeMemory } from "./modules/memory-writer";

// --------------------------------------------------------------
// LOAD USER SESSION (Node runtime version)
// --------------------------------------------------------------
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

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user ?? null;
}

// --------------------------------------------------------------
// OPENAI ROUTER (Single model w/ retry)
// --------------------------------------------------------------
async function callOpenAI(fullBlocks: any[]): Promise<string> {
  const payload = {
    model: "gpt-4.1",
    input: fullBlocks,
  };

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
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
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      if (!res.ok) {
        console.error("[OPENAI] fatal:", res.status, await res.text());
        return "[No reply]";
      }

      const json = await res.json();
      return json?.output?.[0]?.content?.[0]?.text ?? "[No reply]";
    } catch (err) {
      console.error(`[OPENAI] error on attempt ${attempt}`, err);
    }
  }

  return "[No reply]";
}

// --------------------------------------------------------------
// POST /api/chat
// --------------------------------------------------------------
export async function POST(req: Request) {
  const diag: any = { stage: "start" };

  try {
    // ----------------------------------------------------------
    // Parse Body
    // ----------------------------------------------------------
    const body = await req.json().catch(() => null);
    if (!body || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const {
      message,
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicitClientKey,
    } = body;

    diag.body = body;

    // ----------------------------------------------------------
    // Identify User
    // ----------------------------------------------------------
    const user = await getNodeUser(req);
    const canonicalUserKey = user?.id ?? explicitClientKey ?? "guest";
    diag.user = canonicalUserKey;

    // ----------------------------------------------------------
    // Load Context
    // ----------------------------------------------------------
    const context = await assembleContext(
      canonicalUserKey,
      workspaceId,
      message
    );

    // ----------------------------------------------------------
    // Determine Solace Domain
    // ----------------------------------------------------------
    const domain =
      modeHint === "Create"
        ? "optimist"
        : modeHint === "Red Team"
        ? "skeptic"
        : modeHint === "Next Steps"
        ? "arbiter"
        : "guidance";

    // ----------------------------------------------------------
    // Build Prompt
    // ----------------------------------------------------------
    let systemBlock = buildSystemBlock(domain, "");
    let userBlocks = assemblePrompt(context, history, message);

    // ----------------------------------------------------------
    // 🔥 EM-DASH SANITIZATION (Fix for ByteString failures)
    // ----------------------------------------------------------
    const sanitize = (str: string) => str.replace(/—/g, "-");

    systemBlock = {
      ...systemBlock,
      content: systemBlock.content.map((c: any) =>
        c.type === "input_text"
          ? { ...c, text: sanitize(c.text) }
          : c
      ),
    };

    userBlocks = userBlocks.map((b: any) => ({
      ...b,
      content: b.content.map((c: any) =>
        c.type === "input_text"
          ? { ...c, text: sanitize(c.text) }
          : c
      ),
    }));

    const fullBlocks = [systemBlock, ...userBlocks];

    diag.blocks = {
      systemPreview: JSON.stringify(systemBlock).slice(0, 200),
      userCount: userBlocks.length,
    };

    // ----------------------------------------------------------
    // Pick Pipeline
    // ----------------------------------------------------------
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
        })) || "[No arbiter answer]";
    } else {
      finalText = await callOpenAI(fullBlocks);
    }

    diag.finalPreview = finalText.slice(0, 200);

    // ----------------------------------------------------------
    // Write Memory (safe)
    // ----------------------------------------------------------
    try {
      await writeMemory(canonicalUserKey, message, finalText);
    } catch (err) {
      console.error("[MEMORY] write failed", err);
    }

    // ----------------------------------------------------------
    // Return
    // ----------------------------------------------------------
    const res = NextResponse.json({ text: finalText });
    res.headers.set("x-solace-diag", JSON.stringify(diag).slice(0, 1000));
    return res;
  } catch (err: any) {
    console.error("[CHAT ROUTE] fatal", err);
    return NextResponse.json(
      { error: err?.message ?? "ChatRouteError", diag },
      { status: 500 }
    );
  }
}



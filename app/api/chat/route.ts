// --------------------------------------------------------------
// SOLACE CHAT ROUTE — NODE RUNTIME (STABLE)
// Next.js 16 • Supabase SSR • OpenAI Responses API
// --------------------------------------------------------------

export const runtime = "nodejs";       // ✔ FIX: Edge runtime caused hangs
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

  if (error) {
    console.log("[AUTH] getUser error:", error.message);
    return null;
  }
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

  console.log("[OPENAI] Payload:", JSON.stringify(payload).slice(0, 300));

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
        console.warn(`[OPENAI] 429 — retrying in ${wait}ms`);
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

  console.error("[OPENAI] exhausted retries");
  return "[No reply]";
}

// --------------------------------------------------------------
// POST /api/chat
// --------------------------------------------------------------
export async function POST(req: Request) {
  const diag = { stage: "start" } as any;

  try {
    // ----------------------------------------------------------
    // Parse Request Body
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
      userKey: explicitClientKey,    // ← FROM HEADER/BODY IF PROVIDED
    } = body;

    diag.body = body;

    // ----------------------------------------------------------
    // Resolve User Identity
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
    // System + User Prompt Blocks
    // ----------------------------------------------------------
    const domain =
      modeHint === "Create"
        ? "optimist"
        : modeHint === "Red Team"
        ? "skeptic"
        : modeHint === "Next Steps"
        ? "arbiter"
        : "guidance";

    const systemBlock = buildSystemBlock(domain, "");
    const userBlocks = assemblePrompt(context, history, message);
    const fullBlocks = [systemBlock, ...userBlocks];

    diag.blocks = {
      system: JSON.stringify(systemBlock).slice(0, 300),
      userCount: userBlocks.length,
    };

    // ----------------------------------------------------------
    // HYBRID PIPELINE OR SINGLE MODEL
    // ----------------------------------------------------------
    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    let finalText = "";

    if (hybridAllowed) {
      console.log("[HYBRID] pipeline active");
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
      console.log("[NEUTRAL] single-model pipeline active");
      finalText = await callOpenAI(fullBlocks);
    }

    diag.finalPreview = finalText.slice(0, 200);

    // ----------------------------------------------------------
    // MEMORY WRITE
    // ----------------------------------------------------------
    try {
      await writeMemory(canonicalUserKey, message, finalText);
    } catch (err) {
      console.error("[MEMORY] write failed", err);
    }

    // ----------------------------------------------------------
    // Return Response
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


//---------------------------------------------------------------
// Solace Chat Route — Persona ALWAYS active
// Edge Runtime • Full DIAGNOSTIC MODE (A+B+C+D)
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
// MAGIC-LINK-SAFE USER + SESSION EXTRACTOR WITH FULL DIAGNOSTICS
// -------------------------------------------------------------
async function getEdgeUser(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  // 🔍 A1: Raw cookie header
  console.log("\n====================== DIAG A1: RAW COOKIES ======================");
  console.log("[DIAG-A1] Incoming cookie header:", cookieHeader);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const match = cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(`${name}=`));

          if (match) {
            console.log(`[DIAG-A2] Supabase cookie PRESENT: ${name}`);
          } else {
            console.warn(`[DIAG-A2] Supabase cookie MISSING: ${name}`);
          }

          return match ? match.split("=")[1] : undefined;
        },
        set() {},
        remove() {},
      },
    }
  );

  // 🔍 B1: Inspect session tokens
  const sessionRes = await supabase.auth.getSession();

  console.log("\n====================== DIAG B1: SESSION ======================");
  console.log("[DIAG-B1] Session loaded:", {
    hasAccess: !!sessionRes?.data?.session?.access_token,
    hasRefresh: !!sessionRes?.data?.session?.refresh_token,
    expiresAt: sessionRes?.data?.session?.expires_at ?? null,
  });

  // 🔍 A3: Try to retrieve user
  const { data, error } = await supabase.auth.getUser();

  if (error) console.error("[DIAG-A3] getUser() ERROR:", error);
  console.log("[DIAG-A3] Supabase user:", data?.user?.id ?? null);

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
// POST /api/chat
// -------------------------------------------------------------
export async function POST(req: Request) {
  const startTime = Date.now();
  console.log("\n\n==============================================================");
  console.log("🔵 CHAT REQUEST STARTED @", new Date().toISOString());
  console.log("==============================================================");

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

    console.log("\n====================== DIAG A4: USER ======================");
    console.log("[DIAG-A4] canonicalUserKey:", canonicalUserKey);
    console.log("[DIAG-A4] contextKey:", contextKey);

    // ---------------------------------------------------------
    // BUILD CONTEXT BUNDLE
    // ---------------------------------------------------------
    const contextStart = Date.now();
    const context = await assembleContext(contextKey, workspaceId, message);
    console.log(
      `[DIAG] Context assembly time: ${Date.now() - contextStart}ms`
    );

    // ---------------------------------------------------------
    // DOMAIN + BLOCKS
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

    const hybridAllowed =
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps" ||
      founderMode;

    let finalText: string;

    // =========================================================
    // 🔵 DIAG D — OpenAI Pipeline
    // =========================================================
    console.log("\n====================== DIAG D1: OPENAI ======================");
    console.log("[DIAG-D1] Hybrid allowed:", hybridAllowed);
    console.log("[DIAG-D1] Domain:", domain);

    const aiStart = Date.now();

    if (hybridAllowed) {
      console.log("[DIAG-D1] Running *HYBRID* orchestrator pipeline...");
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
      console.log("[DIAG-D1] Running *SINGLE MODEL* pipeline (gpt-4.1)...");

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

      console.log("[DIAG-D2] OpenAI JSON keys:", Object.keys(json));

      finalText = json?.output?.[0]?.content?.[0]?.text ?? "[No reply]";
    }

    console.log(
      `[DIAG-D3] OpenAI pipeline time: ${Date.now() - aiStart}ms`
    );

    // =========================================================
    // 🔵 DIAG C — Memory Writer
    // =========================================================
    console.log("\n====================== DIAG C1: MEMORY ======================");

    if (!canonicalUserKey) {
      console.warn("[DIAG-C1] Skipping memory write — NO USER SIGNED IN.");
    } else {
      console.log("[DIAG-C1] Writing memory for:", canonicalUserKey);
      try {
        const writeStart = Date.now();
        const writeRes = await writeMemory(
          canonicalUserKey,
          message,
          finalText
        );
        console.log("[DIAG-C2] Memory write result:", writeRes);
        console.log(
          `[DIAG-C3] Memory write time: ${Date.now() - writeStart}ms`
        );
      } catch (err) {
        console.error("[DIAG-CERROR] Memory write failed:", err);
      }
    }

    console.log(
      "\n=============================================================="
    );
    console.log(
      `🟢 CHAT RESPONSE SUCCESS — total time: ${
        Date.now() - startTime
      }ms`
    );
    console.log(
      "==============================================================\n\n"
    );

    return NextResponse.json({ text: finalText });
  } catch (err: any) {
    console.error("[chat route] fatal", err);

    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}


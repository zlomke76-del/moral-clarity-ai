// app/api/chat/route.ts
//--------------------------------------------------------------

export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getEdgeUser } from "@/lib/supabase/edge-user";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runHybridPipeline } from "./modules/orchestrator";
import { writeMemory } from "./modules/memory-writer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], workspaceId = null, ministryMode = false, founderMode = false, modeHint = "Neutral" } =
      body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 🔥 REAL user identity from Supabase
    const authUser = await getEdgeUser(req);
    const userKey = authUser?.email ?? null;

    const context = await assembleContext(userKey ?? "guest", workspaceId, message);

    const usingHybrid =
      founderMode ||
      modeHint === "Create" ||
      modeHint === "Red Team" ||
      modeHint === "Next Steps";

    let responseText: string;

    if (usingHybrid) {
      const { finalAnswer } = await runHybridPipeline({
        userMessage: message,
        context,
        history,
        ministryMode,
        modeHint,
        founderMode,
      });

      responseText = finalAnswer || "[No arbiter answer]";
    } else {
      const inputBlocks = assemblePrompt(context, history, message);

      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          input: inputBlocks,
        }),
      });

      const json = await res.json();
      responseText = json.output?.[0]?.content?.[0]?.text ?? "[No reply]";
    }

    // Write memory only if authenticated
    await writeMemory(userKey, message, responseText);

    return NextResponse.json({ text: responseText });
  } catch (err: any) {
    console.error("[chat route] error:", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}



// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { writeMemory } from "./modules/memory-writer";

// REQUIRED: prevents Next.js from pre-rendering this route
export const dynamic = "force-dynamic";

// REQUIRED: ensures proper execution environment
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], userKey = "guest", workspaceId = null } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 1. Build context
    const context = await assembleContext(userKey, workspaceId, message);

    // 2. Build prompt
    const inputBlocks = assemblePrompt(context, history, message);

    // 3. Run model
    const replyText = await runModel(inputBlocks);

    // 4. Hybrid memory write
    await writeMemory(userKey, message, replyText);

    // 5. Return response
    return NextResponse.json({ text: replyText });

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}




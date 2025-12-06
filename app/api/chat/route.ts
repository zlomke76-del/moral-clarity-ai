// app/api/chat/route.ts

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { writeMemory } from "./modules/memory-writer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], userKey = "guest", workspaceId = null } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 1. Build context (persona + memories + news + research)
    const context = await assembleContext(userKey, workspaceId, message);

    // 2. Build flattened prompt block for Responses API
    const inputBlocks = assemblePrompt(context, history, message);

    // 3. Run model
    const replyText = await runModel(inputBlocks);

    // 4. Write memory (hybrid mode)
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


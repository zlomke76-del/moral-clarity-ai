// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { writeMemory } from "./modules/memory-writer";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { message, history = [], userKey = "guest", workspaceId = null } =
      await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const context = await assembleContext(userKey, workspaceId, message);

    const inputBlocks = assemblePrompt(context, history, message);

    const replyText = await runModel(inputBlocks);

    await writeMemory(userKey, message, replyText);

    return NextResponse.json({ text: replyText });
  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}




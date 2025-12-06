// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/context";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,          // the new user message
      history = [],     // full chat history array
      userKey = "guest",
      workspaceId = null,
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // --- 1. Build Solace context (persona, memory, news, research)
    const context = await assembleContext(userKey, workspaceId, message);

    // --- 2. Build Responses API blocks
    const inputBlocks = assemblePrompt(context, history, message);

    // --- 3. Run model using runModel()
    const replyText = await runModel(inputBlocks);

    // --- 4. Return text to frontend
    return NextResponse.json({ text: replyText });

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}


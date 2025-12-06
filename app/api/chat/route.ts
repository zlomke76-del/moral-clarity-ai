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
      messages = [],           // FULL CHAT HISTORY from SolaceDock
      filters = [],
      user_key = "guest",
      workspace_id = null,
      memory_preview = [],
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array empty" }, { status: 400 });
    }

    // Extract last user message
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg?.content) {
      return NextResponse.json({ error: "Missing user message" }, { status: 400 });
    }

    // ----- 1. Build context (persona, memory, news, research)
    const context = await assembleContext(user_key, workspace_id, lastMsg.content);

    // ----- 2. Convert into OpenAI Responses API message structure
    const inputBlocks = assemblePrompt(context, messages);

    // ----- 3. Call model
    const reply = await runModel(inputBlocks);

    // ----- 4. Return plain text
    return NextResponse.json({ text: reply });

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message ?? "Chat failed" },
      { status: 500 }
    );
  }
}


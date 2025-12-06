// app/api/chat/route.ts
import { NextResponse } from "next/server";

import { assembleContext } from "./modules/context";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { bufferStreamIntoText } from "./modules/streamer";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      history = [],
      userKey = "guest",
      workspaceId = null,
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 1. Context
    const context = await assembleContext(userKey, workspaceId, message);

    // 2. Prompt Assembly
    const prompt = assemblePrompt(context, history, message);

    // 3. Run Model (stream=true)
    const stream = await runModel(prompt);

    // 4. Convert stream → final text
    const text = await bufferStreamIntoText(stream);

    return NextResponse.json({ text });

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}


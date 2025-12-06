// app/api/chat/route.ts

import { NextResponse } from "next/server";

import { assembleContext } from "./modules/context";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { streamResult } from "./modules/streamer";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      history = [],           // Full chat history from frontend
      userKey = "guest",
      workspaceId = null,
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    // ---- 1. Build full Solace context -------------------------
    const context = await assembleContext(userKey, workspaceId, message);

    // ---- 2. Build prompt with full history --------------------
    const inputBlocks = assemblePrompt(context, history, message);

    // ---- 3. Run model using Responses API ---------------------
    const stream = await runModel(inputBlocks);

    // ---- 4. Stream result back to frontend --------------------
    return await streamResult(stream);

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}


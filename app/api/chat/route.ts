// app/api/chat/route.ts

import { NextResponse } from "next/server";

import { assembleContext } from "./modules/context";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { streamResult } from "./modules/streamer";
import { executeTool } from "./modules/tools";

import { extractToolCall } from "./modules/types";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userKey = "guest", workspaceId = null } = body;

    // ---- 1. Context -----------------------------------------
    const context = await assembleContext(userKey, workspaceId, message);

    // ---- 2. Prompt Assembly ---------------------------------
    const messages = assemblePrompt(context, message);

    // ---- 3. Run Model ---------------------------------------
    const stream = await runModel(messages);

// 4. Check for tool calls
const iterator = stream[Symbol.asyncIterator]();
const firstChunk = await iterator.next();
const tool = extractToolCall(firstChunk.value);

if (tool) {
  // handle tool call...
}


    // ---- 5. Stream Response ---------------------------------
    return await streamResult({
      async *[Symbol.asyncIterator]() {
        yield firstChunk.value;
        for await (const c of stream) yield c;
      },
    });
  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}

// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { processMemoryWrites } from "./modules/memory-writer";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      history = [],
      userKey,
    } = body;

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 1. Context load
    const context = await assembleContext(userKey);

    // 2. Build Responses API prompt
    const blocks = assemblePrompt(context, history, message);

    // 3. Run model
    const reply = await runModel(blocks);

    // 4. Memory write pipeline
    await processMemoryWrites(userKey, message, reply);

    return NextResponse.json({ text: reply });

  } catch (err: any) {
    console.error("CHAT ROUTE ERROR", err);
    return NextResponse.json(
      { error: err?.message || "Chat failed" },
      { status: 500 }
    );
  }
}



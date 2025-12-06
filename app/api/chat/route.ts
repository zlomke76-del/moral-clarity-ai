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
      message,
      history = [],
      userKey = "guest",
      workspaceId = null,
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 1. Build Solace persona + memory + news + research context
    const context = await assembleContext(userKey, workspaceId, message);

    // 2. Build a VALID Responses API input block
    const inputBlocks = assemblePrompt(context, history, message);

    // 3. Call the model through the router
    const replyText = await runModel(inputBlocks);

    // 4. Return plain JSON { text }
    return NextResponse.json({ text: replyText });

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}


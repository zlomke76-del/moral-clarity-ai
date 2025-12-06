// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { writeMemory } from "./modules/memory-wwriter";  // ✅ corrected import

export const runtime = "edge";


// Very simple trigger: if Solace says "I will remember" or "I'll remember"
// future improvements can expand this pattern matching.
function detectMemoryIntent(replyText: string): boolean {
  if (!replyText) return false;
  const lower = replyText.toLowerCase();
  return (
    lower.includes("i will remember") ||
    lower.includes("i'll remember") ||
    lower.includes("i will store this") ||
    lower.includes("i'll store this")
  );
}


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

    // --- Build context (persona + memory + news + research)
    const context = await assembleContext(userKey, workspaceId, message);

    // --- Build Responses API input blocks
    const inputBlocks = assemblePrompt(context, history, message);

    // --- Run model
    const replyText = await runModel(inputBlocks);

    // --- MEMORY CLEAN-UP
    if (detectMemoryIntent(replyText)) {
      await writeMemory(userKey, message);
    }

    return NextResponse.json({ text: replyText });
  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}



// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { assembleContext } from "./modules/assembleContext";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { writeMemory } from "./modules/memory-writer";  // ✅ FIXED PATH

export const runtime = "edge";

function detectMemoryIntent(replyText: string): boolean {
  if (!replyText) return false;
  const t = replyText.toLowerCase();
  return (
    t.includes("i will remember") ||
    t.includes("i'll remember") ||
    t.includes("i will store this") ||
    t.includes("i'll store this")
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

    // --- Build prompt
    const inputBlocks = assemblePrompt(context, history, message);

    // --- Run LLM
    const replyText = await runModel(inputBlocks);

    // --- Memory-writing trigger
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



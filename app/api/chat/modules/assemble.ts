// modules/assemble.ts

import { ChatMessage } from "./types";
import { buildPersonaBlock } from "./persona";

export function assemblePrompt(context: any, userMessage: string): ChatMessage[] {
  const msgs: ChatMessage[] = [];

  // Persona
  msgs.push({
    role: "system",
    content: buildPersonaBlock(),
  });

  // Memory Pack
  if (context.memoryPack) {
    msgs.push({
      role: "system",
      content: `Memory Pack:\n${JSON.stringify(context.memoryPack, null, 2)}`,
    });
  }

  // News
  if (context.newsDigest) {
    msgs.push({
      role: "system",
      content: `News Digest (Neutral):\n${JSON.stringify(context.newsDigest, null, 2)}`,
    });
  }

  // Deep Research
  if (context.researchContext) {
    msgs.push({
      role: "system",
      content: `Research Context:\n${JSON.stringify(context.researchContext, null, 2)}`,
    });
  }

  // User message (primary)
  msgs.push({
    role: "user",
    content: userMessage,
  });

  return msgs;
}

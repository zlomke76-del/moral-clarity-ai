// app/api/chat/modules/assemble.ts
// -------------------------------------------------------------
// This module builds the Solace SYSTEM BLOCK + USER BLOCK.
// SYSTEM BLOCK = persona + Abrahamic Code + domain mode.
// USER BLOCK = memory packets + chat history + user message.
// -------------------------------------------------------------

import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * Builds the SYSTEM block for the Responses API.
 * This is ALWAYS the first element of the input array.
 */
export function buildSystemBlock(domain: string, extras?: string) {
  const text = buildSolaceSystemPrompt(domain as any, extras);

  return {
    role: "system",
    content: [
      {
        type: "input_text",
        text,
      },
    ],
  };
}

/**
 * Helper: safe stringify blocks
 */
function safeBlock(label: string, data: any) {
  if (!data) return `\n[${label}]: none\n`;
  try {
    return `\n[${label}]: ${JSON.stringify(data, null, 2)}\n`;
  } catch {
    return `\n[${label}]: [unserializable]\n`;
  }
}

/**
 * Builds the USER block sequence.
 * This contains:
 *  - memory facts
 *  - episodic memories
 *  - autobiography
 *  - news digest
 *  - research context
 *  - chat history
 *  - user message
 */
export function assemblePrompt(context: any, history: any[], userMessage: string) {
  let text = "";

  // Persona name is optional but included for transparency
  text += `You are ${context.persona || "Solace"}.\n`;

  // Memory Blocks ------------------------------------------------
  const m = context.memoryPack || {};

  text += safeBlock("User Memories", m.userMemories);
  text += safeBlock("Episodic Memories", m.episodicMemories);
  text += safeBlock("Autobiography", m.autobiography);

  // News + Research ---------------------------------------------
  text += safeBlock("News Digest", context.newsDigest);
  text += safeBlock("Research Context", context.researchContext);

  // History ------------------------------------------------------
  if (history?.length) {
    text += `\n[Chat History]:\n`;
    for (const msg of history) {
      text += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    }
  } else {
    text += `\n[Chat History]: none\n`;
  }

  // User message -------------------------------------------------
  text += `\n[User Message]: ${userMessage}\n`;

  return [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text,
        },
      ],
    },
  ];
}

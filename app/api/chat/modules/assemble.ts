// app/api/chat/modules/assemble.ts
// ALWAYS include Solace persona, Abrahamic Code, and domain identity

import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * safeBlock()
 * Ensures memory blocks are safely embedded into prompts.
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
 * assemblePrompt()
 * Returns USER content only.
 * SYSTEM block is now ALWAYS injected higher in route.ts.
 */
export function assemblePrompt(context: any, history: any[], userMessage: string) {
  let fullText = "";

  // Memory Packs
  fullText += safeBlock("Facts", context.memoryPack.userMemories);
  fullText += safeBlock("Episodes", context.memoryPack.episodicMemories);
  fullText += safeBlock("Autobiography", context.memoryPack.autobiography);

  // News + Research
  fullText += safeBlock("NewsDigest", context.newsDigest);
  fullText += safeBlock("Research", context.researchContext);

  // Chat history
  if (history?.length) {
    fullText += `\n[ChatHistory]:\n`;
    for (const msg of history) {
      fullText += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    }
  } else {
    fullText += `\n[ChatHistory]: none\n`;
  }

  // User message
  fullText += `\n[UserMessage]: ${userMessage}\n`;

  return [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: fullText,
        },
      ],
    },
  ];
}

/**
 * buildSystemBlock()
 * Used by route.ts to inject the correct persona settings.
 */
export function buildSystemBlock(domain: string, extras?: string) {
  const sys = buildSolaceSystemPrompt(domain as any, extras);
  return {
    role: "system",
    content: [{ type: "input_text", text: sys }],
  };
}


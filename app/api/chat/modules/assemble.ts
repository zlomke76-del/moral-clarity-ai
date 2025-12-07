// app/api/chat/modules/assemble.ts

import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

function safeBlock(label: string, data: any) {
  if (!data) return `\n[${label}]: none\n`;
  try {
    return `\n[${label}]: ${JSON.stringify(data, null, 2)}\n`;
  } catch {
    return `\n[${label}]: [unserializable]\n`;
  }
}

/**
 * assemblePrompt
 *
 * This is the "simple" / neutral path used when we are NOT
 * running the full Optimist → Skeptic → Arbiter hybrid pipeline.
 *
 * It still gets:
 * - the unified Solace persona (Abrahamic Code, etc.)
 * - userMemories, episodicMemories, autobiography
 * - newsDigest and researchContext
 * - chat history + current user message
 */
export function assemblePrompt(
  context: any,
  history: any[],
  userMessage: string
) {
  let fullText = "";

  // 1) Canonical Solace persona (Abrahamic Code spine)
  fullText += buildSolaceSystemPrompt(
    "core",
    `
You are operating in the general chat route.

Use the structured blocks below as your only external context:
- [UserMemories]
- [EpisodicMemories]
- [Autobiography]
- [NewsDigest]
- [ResearchContext]

Do not invent facts outside of these plus your base training.
When in doubt, be honest about uncertainty.
    `.trim()
  );

  // 2) Memory + context blocks (aligned with assembleContext.ts)
  const mp = context?.memoryPack || {};

  fullText += safeBlock("UserMemories", mp.userMemories);
  fullText += safeBlock("EpisodicMemories", mp.episodicMemories);
  fullText += safeBlock("Autobiography", mp.autobiography);

  fullText += safeBlock("NewsDigest", context?.newsDigest);
  fullText += safeBlock("ResearchContext", context?.researchContext);

  // 3) Chat history
  if (history?.length) {
    fullText += `\n[ChatHistory]:\n`;
    for (const msg of history) {
      fullText += `${String(msg.role || "").toUpperCase()}: ${
        msg.content ?? ""
      }\n`;
    }
  } else {
    fullText += `\n[ChatHistory]: none\n`;
  }

  // 4) Current user message (anchor)
  fullText += `\n[UserMessage]: ${userMessage}\n`;

  // Responses API input shape
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


// app/api/chat/modules/assemble.ts
// -------------------------------------------------------------
// SYSTEM BLOCK + USER CONTEXT BLOCK ASSEMBLER
// For Solace Hybrid Pipeline (Optimist → Skeptic → Arbiter)
// -------------------------------------------------------------

import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * SYSTEM BLOCK
 * Builds the persona + domain prompt as a Responses API block.
 */
export function buildSystemBlock(domain: string, extras?: string) {
  const systemText = buildSolaceSystemPrompt(domain as any, extras);

  return {
    role: "system",
    content: [
      {
        type: "input_text",
        text: systemText,
      },
    ],
  };
}

/**
 * USER CONTEXT ASSEMBLER
 * Takes:
 * • context (persona, memories, news, research)
 * • history (array of {role, content})
 * • user message
 *
 * Produces a single USER block that the LLM will read.
 */
export function assemblePrompt(
  context: any,
  history: any[],
  userMessage: string
) {
  const safeJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return "[]";
    }
  };

  const blockText = `
[User Message]
${userMessage}

[Persona]
${context.persona || "Solace"}

[User Memories]
${safeJson(context.memoryPack.userMemories)}

[Episodic Memories]
${safeJson(context.memoryPack.episodicMemories)}

[Autobiography]
${safeJson(context.memoryPack.autobiography)}

[News Digest]
${safeJson(context.newsDigest)}

[Research Context]
${safeJson(context.researchContext)}

[Chat History]
${safeJson(history)}
  `.trim();

  return [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: blockText,
        },
      ],
    },
  ];
}


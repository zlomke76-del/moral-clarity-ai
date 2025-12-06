// modules/assemble.ts

/**
 * Safely format a block of text with a label.
 */
function block(label: string, text: string | null | undefined) {
  if (!text) return `\n[${label}]: none\n`;
  return `\n[${label}]:\n${text.trim()}\n`;
}

/**
 * FINAL Responses-API prompt builder.
 *
 * Everything is flattened into a **single input_text block**
 * which the Responses API requires.
 */
export function assemblePrompt(
  context: any,
  history: any[],
  userMessage: string
) {
  let fullText = "";

  // Persona
  fullText += `You are ${context.persona}, a stable, empathetic, neutral, memory-aware guide.\n`;

  // Memory (already summarized text)
  fullText += block("Relevant memory", context.memoryPack);

  // News digest (already summarized upstream)
  fullText += block("News digest", context.newsDigest);

  // Research context
  fullText += block("Research context", context.researchContext);

  // Chat history
  if (history?.length > 0) {
    fullText += `\n[Chat history]:\n`;
    for (const msg of history) {
      if (!msg?.role || !msg?.content) continue;
      fullText += `${msg.role.toUpperCase()}: ${String(msg.content)}\n`;
    }
  } else {
    fullText += `\n[Chat history]: none\n`;
  }

  // Current user message
  fullText += `\n[User message]: ${userMessage}\n`;

  // Return Responses API-compatible input
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



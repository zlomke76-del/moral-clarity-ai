// modules/assemble.ts

/**
 * Safely stringify memory, news, research, or history.
 * If the data cannot be stringified, produce a readable fallback.
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
 * FINAL Responses-API prompt builder.
 *
 * - Flatten everything into text.
 * - Use ONLY "input_text" as required by the Responses API.
 * - Solace receives persona + memory + news + research + history + user message.
 */
export function assemblePrompt(
  context: any,
  history: any[],
  userMessage: string
) {
  // --- Build the FULL flattened text prompt -------------------------------
  let fullText = "";

  // Persona
  fullText += `You are ${context.persona}, a stable, empathetic, neutral, memory-aware guide.\n`;

  // Memory
  fullText += safeBlock("Relevant memory", context.memoryPack);

  // News digest
  fullText += safeBlock("News digest", context.newsDigest);

  // Research context
  fullText += safeBlock("Research context", context.researchContext);

  // Chat history
  if (history && Array.isArray(history) && history.length > 0) {
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

  // --- Return the SINGLE Responses-API input block ------------------------
  return [
    {
      role: "user",
      content: [
        {
          type: "input_text",   // ✅ Correct API type
          text: fullText,
        },
      ],
    },
  ];
}



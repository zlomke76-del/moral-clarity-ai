// modules/assemble.ts

/**
 * Safe stringify for structured context parts.
 */
function safeText(label: string, data: any) {
  if (!data) return `${label}: none`;
  try {
    return `${label}: ${JSON.stringify(data)}`;
  } catch {
    return `${label}: [unserializable]`;
  }
}

/**
 * Assembles the full Responses-API-compliant "input" array.
 *
 * Each block is:
 * {
 *   role: "system" | "user" | "assistant",
 *   content: [{ type: "input_text", text: "..." }]
 * }
 *
 * This ensures compatibility with the new response.delta.text streaming format.
 */
export function assemblePrompt(context: any, history: any[], userMessage: string) {
  const input: any[] = [];

  // --- SYSTEM: persona anchor
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text:
          `${context.persona} operates with ethics, clarity, neutrality, memory, and stable reasoning.`
      }
    ]
  });

  // --- SYSTEM: memory pack
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("Relevant memory", context.memoryPack)
      }
    ]
  });

  // --- SYSTEM: news digest
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("News digest", context.newsDigest)
      }
    ]
  });

  // --- SYSTEM: research context
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("Research context", context.researchContext)
      }
    ]
  });

  // --- FULL CHAT HISTORY
  for (const msg of history) {
    if (!msg?.role || !msg?.content) continue;

    input.push({
      role: msg.role,
      content: [
        {
          type: "input_text",
          text: String(msg.content)
        }
      ]
    });
  }

  // --- CURRENT USER MESSAGE
  input.push({
    role: "user",
    content: [
      {
        type: "input_text",
        text: userMessage
      }
    ]
  });

  return input;
}



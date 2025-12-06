// modules/assemble.ts

function safeText(label: string, data: any) {
  if (!data) return `${label}: none`;
  try {
    return `${label}: ${JSON.stringify(data)}`;
  } catch {
    return `${label}: [unserializable]`;
  }
}

//
// Responses API expects plain strings for content
//
export function assemblePrompt(context: any, history: any[], userMessage: string) {
  const input: any[] = [];

  // 1. Persona system prompt
  input.push({
    role: "system",
    content: `${context.persona} operates with ethics, clarity, neutrality, memory, and stable reasoning.`,
  });

  // 2. Memory
  input.push({
    role: "system",
    content: safeText("Relevant memory", context.memoryPack),
  });

  // 3. News digest
  input.push({
    role: "system",
    content: safeText("News digest", context.newsDigest),
  });

  // 4. Research context
  input.push({
    role: "system",
    content: safeText("Research context", context.researchContext),
  });

  // 5. FULL CHAT HISTORY
  for (const msg of history) {
    if (!msg || !msg.role || !msg.content) continue;
    input.push({
      role: msg.role,
      content: String(msg.content),
    });
  }

  // 6. CURRENT USER MESSAGE
  input.push({
    role: "user",
    content: userMessage,
  });

  return input;
}



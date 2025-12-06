// modules/assemble.ts

function safe(label: string, data: any) {
  try {
    return `${label}: ${JSON.stringify(data)}`;
  } catch {
    return `${label}: [unserializable]`;
  }
}

export function assemblePrompt(context: any, fullHistory: any[]) {
  const input: any[] = [];

  // SYSTEM PERSONA
  input.push({
    role: "system",
    content: [
      {
        type: "text",
        text: `${context.persona} operates with clarity, neutrality, memory, and ethical reasoning.`,
      },
    ],
  });

  // MEMORY PACK
  input.push({
    role: "system",
    content: [
      {
        type: "text",
        text: safe("Relevant Memory", context.memoryPack),
      },
    ],
  });

  // NEWS DIGEST
  input.push({
    role: "system",
    content: [
      {
        type: "text",
        text: safe("News Digest", context.newsDigest),
      },
    ],
  });

  // RESEARCH CONTEXT
  input.push({
    role: "system",
    content: [
      {
        type: "text",
        text: safe("Research Context", context.researchContext),
      },
    ],
  });

  // FULL CHAT HISTORY
  for (const msg of fullHistory) {
    if (!msg?.role || !msg?.content) continue;

    input.push({
      role: msg.role,
      content: [{ type: "text", text: String(msg.content) }],
    });
  }

  return input;
}



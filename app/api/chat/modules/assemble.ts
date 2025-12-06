// modules/assemble.ts

function safeText(label: string, data: any) {
  if (!data) return `${label}: none`;
  try {
    return `${label}: ${JSON.stringify(data)}`;
  } catch {
    return `${label}: [unserializable]`;
  }
}

export function assemblePrompt(context: any, userMessage: string) {
  const messages = [];

  // SYSTEM / PERSONA
  messages.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: `${context.persona} operates with ethics, clarity, memory, and neutrality.`
      }
    ]
  });

  // MEMORY PACK (safe wrapper)
  messages.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("Memory pack", context.memoryPack)
      }
    ]
  });

  // NEWS DIGEST (safe wrapper)
  messages.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("News digest", context.newsDigest)
      }
    ]
  });

  // RESEARCH CONTEXT (safe wrapper)
  messages.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("Research context", context.researchContext)
      }
    ]
  });

  // USER MESSAGE (guaranteed string)
  messages.push({
    role: "user",
    content: [
      {
        type: "input_text",
        text: userMessage || " "
      }
    ]
  });

  return messages;
}


// modules/assemble.ts

function safeText(label: string, data: any) {
  if (!data) return `${label}: none`;
  try {
    return `${label}: ${JSON.stringify(data)}`;
  } catch {
    return `${label}: [unserializable]`;
  }
}

export function assemblePrompt(context: any, history: any[], userMessage: string) {
  const input: any[] = [];

  // ---- SYSTEM: persona --------------------------------------------------
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: `${context.persona} operates with ethics, clarity, neutrality, memory, and stable reasoning.`,
      },
    ],
  });

  // ---- SYSTEM: memory pack ---------------------------------------------
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("Relevant memory", context.memoryPack),
      },
    ],
  });

  // ---- SYSTEM: news digest ---------------------------------------------
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("News digest", context.newsDigest),
      },
    ],
  });

  // ---- SYSTEM: research context ----------------------------------------
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: safeText("Research context", context.researchContext),
      },
    ],
  });

  // ---- FULL CHAT HISTORY (user + assistant) -----------------------------
  for (const msg of history) {
    if (!msg || !msg.role || !msg.content) continue;

    input.push({
      role: msg.role,
      content: [
        {
          type: "input_text",
          text: String(msg.content),
        },
      ],
    });
  }

  // ---- CURRENT USER MESSAGE --------------------------------------------
  input.push({
    role: "user",
    content: [
      {
        type: "input_text",
        text: userMessage,
      },
    ],
  });

  return input;
}


// app/api/chat/modules/assemble.ts

function safeBlock(label: string, data: any) {
  if (!data) return `\n[${label}]: none\n`;
  try {
    return `\n[${label}]: ${JSON.stringify(data, null, 2)}\n`;
  } catch {
    return `\n[${label}]: [unserializable]\n`;
  }
}

export function assemblePrompt(context: any, history: any[], userMessage: string) {
  let fullText = "";

  fullText += `You are ${context.persona}, a stable, empathetic, neutral, memory-aware guide.\n`;

  fullText += safeBlock("Facts", context.memoryPack.facts);
  fullText += safeBlock("Episodes", context.memoryPack.episodes);

  // Chat history
  if (history?.length) {
    fullText += `\n[Chat history]:\n`;
    for (const msg of history) {
      fullText += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    }
  } else {
    fullText += `\n[Chat history]: none\n`;
  }

  fullText += `\n[User message]: ${userMessage}\n`;

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



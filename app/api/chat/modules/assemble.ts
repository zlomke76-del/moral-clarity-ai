// app/api/chat/modules/assemble.ts
// ---------------------------------------------------------------
// Assembles the USER block only.
// System persona is injected by buildSolaceSystemPrompt() in
// orchestrator.ts or in the neutral path of route.ts.
// ---------------------------------------------------------------

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

  // ❌ Removed the persona override line:
  // "You are ${context.persona}, a stable empathetic guide..."
  // Persona now comes EXCLUSIVELY from buildSolaceSystemPrompt().

  fullText += safeBlock("Facts", context.memoryPack.userMemories);
  fullText += safeBlock("Episodes", context.memoryPack.episodicMemories);
  fullText += safeBlock("Autobiography", context.memoryPack.autobiography);

  if (context.newsDigest) {
    fullText += safeBlock("News Digest", context.newsDigest);
  }

  if (context.researchContext) {
    fullText += safeBlock("Research", context.researchContext);
  }

  // --- Chat History -------------------------------------------
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


// modules/assemble.ts

export function assemblePrompt(context: any, userMessage: string) {
  const messages = [];

  // SYSTEM / PERSONA BLOCK
  messages.push({
    role: "system",
    content: [
      {
        type: "text",
        text: context.persona + " operates with ethics, neutrality, and memory.",
      }
    ]
  });

  // MEMORY PACK
  if (context.memoryPack) {
    messages.push({
      role: "system",
      content: [
        {
          type: "text",
          text: `Relevant memory:\n${JSON.stringify(context.memoryPack)}`
        }
      ]
    });
  }

  // NEWS DIGEST
  if (context.newsDigest) {
    messages.push({
      role: "system",
      content: [
        {
          type: "text",
          text: `News digest:\n${JSON.stringify(context.newsDigest)}`
        }
      ]
    });
  }

  // USER MESSAGE
  messages.push({
    role: "user",
    content: [
      { type: "text", text: userMessage }
    ]
  });

  return messages;
}

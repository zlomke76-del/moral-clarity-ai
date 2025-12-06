// modules/assemble.ts

export function assemblePrompt(context: any, userMessage: string) {
  const messages = [];

  // SYSTEM / PERSONA BLOCK
  messages.push({
    role: "system",
    content: [
      {
        type: "input_text",
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
          type: "input_text",
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
          type: "input_text",
          text: `News digest:\n${JSON.stringify(context.newsDigest)}`
        }
      ]
    });
  }

  // RESEARCH CONTEXT
  if (context.researchContext) {
    messages.push({
      role: "system",
      content: [
        {
          type: "input_text",
          text: `Research context:\n${JSON.stringify(context.researchContext)}`
        }
      ]
    });
  }

  // USER MESSAGE
  messages.push({
    role: "user",
    content: [
      {
        type: "input_text",
        text: userMessage
      }
    ]
  });

  return messages;
}


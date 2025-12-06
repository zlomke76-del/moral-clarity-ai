// app/api/chat/modules/streamer.ts

export async function bufferStreamIntoText(stream: any): Promise<string> {
  let result = "";

  for await (const chunk of stream) {
    const delta = chunk?.output_text ?? "";
    if (typeof delta === "string") {
      result += delta;
    }
  }

  return result.trim();
}


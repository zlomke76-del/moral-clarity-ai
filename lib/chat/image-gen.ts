// lib/chat/image-gen.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateImage(prompt: string): Promise<string> {
  if (!prompt || !prompt.trim()) {
    throw new Error("Empty image prompt");
  }

  const res = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
    n: 1,
  });

  const url = res?.data?.[0]?.url;
  if (!url) throw new Error("No image URL returned from image model");

  return url;
}

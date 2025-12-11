// app/api/chat/modules/image-router.ts
//--------------------------------------------------------------
// Unified Solace Image Generator — FINAL WORKING VERSION
//--------------------------------------------------------------

import OpenAI from "openai";

export async function generateImage(prompt: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const res = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
    n: 1,
  });

  const url = res.data?.[0]?.url;
  if (!url) throw new Error("Image generation returned no URL.");

  return url;
}


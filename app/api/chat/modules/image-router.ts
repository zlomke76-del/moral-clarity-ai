// app/api/chat/modules/image-router.ts
//--------------------------------------------------------------
// Unified Solace Image Generator — FIXED FOR NEW OPENAI FORMAT
//--------------------------------------------------------------

import OpenAI from "openai";

export async function generateImage(prompt: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  // MUST request base64 JSON — URLs are no longer provided directly
  const res = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
    n: 1,
    response_format: "b64_json"
  });

  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image generation returned no base64 data.");

  // Convert base64 → data URL so frontend can render it immediately
  const url = `data:image/png;base64,${b64}`;
  return url;
}

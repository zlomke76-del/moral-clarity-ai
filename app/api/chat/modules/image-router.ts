// app/api/chat/modules/image-router.ts
//--------------------------------------------------------------
// Modern OpenAI Image Generator (Responses API compliant)
//--------------------------------------------------------------

import OpenAI from "openai";

export async function generateImage(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const client = new OpenAI({ apiKey });

  // NEW PROPER API
  const response = await client.responses.create({
    model: "gpt-image-1",
    input: prompt,
    // Required for images
    response_format: "json",
    // prevents hallucinated alt text etc.
    reasoning: { effort: "medium" }
  });

  // Extract base64 from response
  const imagePart = response.output?.find(
    (o) => o.type === "image"
  );

  if (!imagePart || !imagePart.image_base64) {
    throw new Error("Image generation did not return base64");
  }

  // Convert base64 → Blob store? CDN? data URL?
  // For now return data URL
  return `data:image/png;base64,${imagePart.image_base64}`;
}

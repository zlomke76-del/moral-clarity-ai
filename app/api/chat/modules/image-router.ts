import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generates an image and returns a browser-safe URL
 */
export async function generateImage(prompt: string): Promise<string> {
  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
    quality: "high",
    background: "opaque",
  });

  const b64 = result.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error("Image generation failed: no base64 payload returned");
  }

  // ✅ CRITICAL FIX:
  // Convert raw base64 into a browser-safe data URL
  return `data:image/png;base64,${b64}`;
}

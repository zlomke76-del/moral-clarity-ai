// --------------------------------------------------------------
// Unified Solace Image Generator — BASE64-SAFE FINAL VERSION
// --------------------------------------------------------------

import OpenAI from "openai";

export async function generateImage(prompt: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  try {
    const res = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      n: 1,
    });

    console.log("[IMAGE ROUTER RAW]", res);

    // Prefer URL if returned (some accounts return URLs)
    const directUrl = res.data?.[0]?.url;
    if (directUrl) return directUrl;

    // Otherwise extract base64
    const b64 = res.data?.[0]?.b64_json;
    if (!b64) {
      console.error("[IMAGE ROUTER] No b64_json in response:", res);
      throw new Error("Image generation returned neither URL nor base64.");
    }

    // Convert to data URL for SolaceDock
    const dataUrl = `data:image/png;base64,${b64}`;
    return dataUrl;

  } catch (err) {
    console.error("[IMAGE ROUTER ERROR]", err);
    throw err;
  }
}

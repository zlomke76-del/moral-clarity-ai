// --------------------------------------------------------------
// Unified Solace Image Generator — FINAL WORKING VERSION
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

    const url = res.data?.[0]?.url;

    if (!url) {
      console.error("[IMAGE ROUTER] No URL in response:", res);
      throw new Error("Image generation returned no URL.");
    }

    return url;

  } catch (err) {
    console.error("[IMAGE ROUTER ERROR]", err);
    throw err;
  }
}

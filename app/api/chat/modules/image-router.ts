// app/api/chat/modules/image-router.ts
//--------------------------------------------------------------
// TEMP DIAGNOSTIC IMAGE ROUTER – FIND EXACT FAILURE
//--------------------------------------------------------------

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
      response_format: "b64_json",
    });

    console.log("[IMAGE ROUTER RAW RESPONSE]", JSON.stringify(res, null, 2));

    const b64 = res.data?.[0]?.b64_json;

    if (!b64) {
      console.error("[IMAGE ROUTER] Missing b64_json. Full response:", res);
      throw new Error("No base64 returned from OpenAI.");
    }

    return `data:image/png;base64,${b64}`;
  } catch (err: any) {
    console.error("[IMAGE ROUTER ERROR]", err);
    throw err;
  }
}

// app/api/chat/modules/model-router.ts

import OpenAI from "openai";

export const MODELS = {
  OPTIMIST: "gpt-4.1",
  SKEPTIC: "gpt-4.1-mini",
  ARBITER: "gpt-5",

  // Future LLMs (not used yet)
  FUTURE_OPTIMIST: "placeholder:optimist-llm",
  FUTURE_SKEPTIC: "placeholder:skeptic-llm",
  FUTURE_ARBITER: "placeholder:arbiter-llm",
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Responses API extraction helper
export function extractText(res: any): string {
  try {
    const block = res.output?.[0];
    const content = block?.content?.[0];
    return content?.text ?? "";
  } catch {
    return "";
  }
}

export async function callModel(model: string, inputBlocks: any[]) {
  const res = await client.responses.create({
    model,
    input: inputBlocks,
  });
  return extractText(res);
}

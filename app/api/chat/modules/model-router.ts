// modules/model-router.ts

import { OpenAI } from "openai";
import { DEFAULT_MODEL, FALLBACK_MODEL } from "./constants";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function runModel(inputBlocks: any[]) {
  try {
    const res = await client.responses.create({
      model: DEFAULT_MODEL,
      input: inputBlocks,
    });

    return extractText(res);

  } catch (err) {
    console.error("[router] primary model failed", err);

    const res = await client.responses.create({
      model: FALLBACK_MODEL,
      input: inputBlocks,
    });

    return extractText(res);
  }
}

function extractText(res: any): string {
  try {
    const out = res.output_text;
    return out ?? "[No reply]";
  } catch {
    return "[No reply]";
  }
}

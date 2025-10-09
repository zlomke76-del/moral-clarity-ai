// lib/openai.ts
import type OpenAI from "openai";

let _client: OpenAI | null = null;

export async function getOpenAI(): Promise<OpenAI> {
  if (!_client) {
    const { default: OpenAI } = await import("openai"); // lazy, runtime import
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _client;
}

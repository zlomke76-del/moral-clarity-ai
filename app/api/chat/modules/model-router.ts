// app/api/chat/modules/model-router.ts
//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (MULTI-MESSAGE READY)
// ASCII SAFE — FINAL VERSION
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// callModel(model, messages[])
// messages MUST be an array of:
// { role: "system" | "assistant" | "user", content: string }
// --------------------------------------------------------------
export async function callModel(model: string, messages: any[]) {
  try {
    const sanitized = messages.map((m) => ({
      role: m.role,
      content: sanitizeForModel(m.content || "")
    }));

    const res = await client.responses.create({
      model,
      input: sanitized
    });

    const out = res.output_text ?? "";
    return typeof out === "string" ? out : String(out);

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}

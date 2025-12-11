//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (FINAL, TYPE-SAFE)
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// normalize(prompt) → ALWAYS produce a valid ResponseInput
// --------------------------------------------------------------
function normalizeInput(prompt: any) {
  // CASE 1: string → wrap into user message
  if (typeof prompt === "string") {
    return [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: sanitizeForModel(prompt),
          },
        ],
      },
    ];
  }

  // CASE 2: array of strings → each becomes a user block
  if (Array.isArray(prompt) && typeof prompt[0] === "string") {
    return prompt.map((text) => ({
      role: "user",
      content: [
        {
          type: "input_text",
          text: sanitizeForModel(text),
        },
      ],
    }));
  }

  // CASE 3: already structured messages → sanitize & return
  if (Array.isArray(prompt) && typeof prompt[0] === "object") {
    return prompt.map((msg) => ({
      role: msg.role ?? "user",
      content: msg.content.map((c: any) => ({
        type: "input_text",
        text: sanitizeForModel(c.text ?? ""),
      })),
    }));
  }

  // fallback: stringify safely
  return [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: sanitizeForModel(String(prompt)),
        },
      ],
    },
  ];
}

// --------------------------------------------------------------
// callModel(model, prompt)
// --------------------------------------------------------------
export async function callModel(model: string, prompt: any) {
  try {
    const input = normalizeInput(prompt);

    const res = await client.responses.create({
      model,
      input, // <-- ALWAYS a valid ResponseInput now
    });

    return res.output_text ?? "";

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}

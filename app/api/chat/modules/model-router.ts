//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (FINAL, SAFE VERSION)
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// normalizeInput(prompt): ALWAYS produce ResponseInput
// --------------------------------------------------------------
function normalizeInput(prompt: any) {
  // CASE 1: simple string → wrap
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

  // CASE 2: array of strings → convert all to user messages
  if (Array.isArray(prompt) && prompt.every((p) => typeof p === "string")) {
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

  // CASE 3: array of objects (structured messages)
  if (Array.isArray(prompt) && prompt.every((p) => typeof p === "object")) {
    return prompt.map((msg) => {
      const role = msg.role ?? "user";
      const content = Array.isArray(msg.content)
        ? msg.content.map((c: any) => ({
            type: "input_text",
            text: sanitizeForModel(c?.text ?? ""),
          }))
        : [
            {
              type: "input_text",
              text: sanitizeForModel(String(msg?.text ?? "")),
            },
          ];

      return { role, content };
    });
  }

  // CASE 4: unexpected objects → stringify
  if (typeof prompt === "object") {
    return [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: sanitizeForModel(JSON.stringify(prompt)),
          },
        ],
      },
    ];
  }

  // FALLBACK: everything else → string wrapper
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
    const cleanInput = normalizeInput(prompt);

    const res = await client.responses.create({
      model,
      input: cleanInput,
    });

    return typeof res.output_text === "string"
      ? res.output_text
      : String(res.output_text ?? "");

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}

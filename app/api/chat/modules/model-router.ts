// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// MODEL ROUTER — Clean, strict, OpenAI Responses API compatible
// --------------------------------------------------------------

import OpenAI from "openai";
import {
  sanitizeForModel,
  sanitizeForMemory
} from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

/**
 * callModel(model: string, messages: Array<{ role, content }>)
 *
 * All hybrid stages use this router. It accepts a simple
 * array of { role, content } and returns a plain string.
 */
export async function callModel(
  model: string,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    // ----------------------------------------------------------
    // Convert Solace's internal messages → Responses API input
    // Responses API wants *string or structured input_text*
    // ----------------------------------------------------------

    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: [
        {
          type: "input_text",
          text: sanitizeForModel(String(m.content || ""))
        }
      ]
    }));

    // ----------------------------------------------------------
    // Create the response via OpenAI Responses API
    // ----------------------------------------------------------
    const response = await client.responses.create({
      model,
      input: sanitizedMessages,
      reasoning: { effort: "medium" }
    });

    // ----------------------------------------------------------
    // Extract text output reliably
    // Priority:
    //   1. output_text (easy mode)
    //   2. output[0].content[0].text (structured mode)
    // ----------------------------------------------------------

    let text: string | undefined = undefined;

    if (response.output_text) {
      text = response.output_text;
    } else if (Array.isArray(response.output)) {
      const first = response.output[0];

      // output items contain "content" only when type=message
      if (first && "content" in first && Array.isArray(first.content)) {
        const c0 = first.content[0];
        if (c0 && "text" in c0) {
          text = c0.text;
        }
      }
    }

    if (!text) text = "[empty response]";

    // DO NOT sanitize UI output here — return full unicode
    return text;

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[model router failure]";
  }
}

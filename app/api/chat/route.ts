import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// You can still use gpt-5-nano here:
const MODEL = process.env.OPENAI_MODEL || "gpt-5-nano";

// CORS
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com";

// -------- Guidelines --------
const GUIDELINE_NEUTRAL =
  process.env.GUIDELINE_NEUTRAL ||
  `Neutral mode:
- Be clear, structured, and impartial.
- Frame using recognized moral, legal, and policy frameworks.
- Identify uncertainties; avoid speculation.`;

const GUIDELINE_MINISTRY =
  process.env.GUIDELINE_MINISTRY ||
  `Ministry add-on:
- Offer pastoral counsel grounded in Scripture and Christian tradition.
- Emphasize humility, human dignity, and responsibility before God.
- Be gentle, truthful, and non-partisan; cite verses appropriately.`;

const GUIDELINE_GUIDANCE =
  process.env.GUIDELINE_GUIDANCE ||
  `Guidance add-on:
- Red-team arguments for bias and failure modes.
- Provide risk registers, decision trees, and “next steps”.
- Separate facts vs. interpretations; avoid certainty inflation.`;

// ------- System prompt -------
function buildSystemPrompt(filters: string[]) {
  const parts = [GUIDELINE_NEUTRAL];
  if (filters?.includes("ministry")) parts.push(GUIDELINE_MINISTRY);
  if (filters?.includes("guidance")) parts.push(GUIDELINE_GUIDANCE);
  parts.push(
    `Format:
- Start with a 1–2 sentence answer.
- Then give short bullets under clear headings.
- Mark uncertainties plainly.`
  );
  return parts.join("\n\n");
}

// ------- Rolling memory (newest 5 turns) -------
const MAX_TURNS = 5;
function trimConversation(messages: Array<{ role: string; content: string }>) {
  if (!Array.isArray(messages)) return [];
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}

// ------- Robust extractor for Responses API -------
function extractText(resp: any): string {
  // 1) Most SDKs expose this:
  if (resp?.output_text && typeof resp.output_text === "string") {
    return resp.output_text.trim();
  }

  // 2) Some versions put it under .content[].text
  const contentArr = resp?.content;
  if (Array.isArray(contentArr)) {
    for (const c of contentArr) {
      if (typeof c?.text === "string" && c.text.trim()) {
        return c.text.trim();
      }
      // nested shapes: c?.content?.[0]?.text
      if (Array.isArray(c?.content)) {
        for (const inner of c.content) {
          if (typeof inner?.text === "string" && inner.text.trim()) {
            return inner.text.trim();
          }
        }
      }
    }
  }

  // 3) Some versions expose .output[].content[].text
  const out = resp?.output;
  if (Array.isArray(out)) {
    const pieces: string[] = [];
    for (const item of out) {
      if (Array.isArray(item?.content)) {
        for (const inner of item.content) {
          if (typeof inner?.text === "string" && inner.text.trim()) {
            pieces.push(inner.text.trim());
          }
        }
      }
    }
    if (pieces.length) return pieces.join("\n\n");
  }

  return "";
}

/* ---------- CORS preflight ---------- */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/* --------------- POST --------------- */
export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "";
    if (origin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { error: `Origin not allowed: ${origin}` },
        {
          status: 403,
          headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
        }
      );
    }

    const body = await req.json();
    const { messages = [], filters = [] } = body || {};

    const rolled = trimConversation(messages);
    const system = buildSystemPrompt(filters);

    // Flatten conversation into one prompt string
    const transcript = rolled
      .map((m: any) => {
        const who = m.role === "assistant" ? "Assistant" : "User";
        return `${who}: ${String(m.content || "")}`;
      })
      .join("\n");

    const fullPrompt =
      `System instructions:\n${system}\n\n` +
      `Conversation (last ${MAX_TURNS} turns, newest last):\n${transcript}\n\n` +
      `Assistant:`; // cue the reply

    // ✅ Use simple string input (most tolerant across SDK versions/models)
    const response = await client.responses.create({
      model: MODEL,
      input: fullPrompt,
      max_output_tokens: 800,
    });

    let text = extractText(response);

    if (!text) {
      // Give a visible diagnostic instead of a blank bubble.
      text =
        "[No content returned by model] " +
        "(Diagnostic: empty response payload; check model name/APIs or try again.)";
    }

    return NextResponse.json(
      { text, model: MODEL, sources: [] }, // sources disabled while search is OFF
      {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    // Return the error message so you see it in the UI
    return NextResponse.json(
      { error: err?.message || String(err) },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

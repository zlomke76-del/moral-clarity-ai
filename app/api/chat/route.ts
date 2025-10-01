// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-5-nano";
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com";

// ---------------- Guidelines ----------------
const GUIDELINE_NEUTRAL = `Neutral mode:
- Be clear, structured, and impartial.
- Frame using recognized moral, legal, and policy frameworks.
- Identify uncertainties; avoid speculation.`;

const GUIDELINE_MINISTRY = `Ministry add-on:
- Offer pastoral counsel grounded in Scripture and Christian tradition.
- Emphasize humility, human dignity, and responsibility before God.
- Be gentle, truthful, and non-partisan; cite verses appropriately.`;

const GUIDELINE_GUIDANCE = `Guidance add-on:
- Red-team arguments for bias and failure modes.
- Provide risk registers, decision trees, and “next steps”.
- Separate facts vs. interpretations; avoid certainty inflation.`;

// Build system prompt
function buildSystemPrompt(filters: string[]) {
  const parts = [GUIDELINE_NEUTRAL];
  if (filters.includes("ministry")) parts.push(GUIDELINE_MINISTRY);
  if (filters.includes("guidance")) parts.push(GUIDELINE_GUIDANCE);

  parts.push(
    `Format:
- Start with a 1–2 sentence answer.
- Then give short bullets under clear headings.`
  );

  return parts.join("\n\n");
}

// Rolling memory: newest 5 turns
const MAX_TURNS = 5;
function trimConversation(messages: Array<{ role: string; content: string }>) {
  if (!Array.isArray(messages)) return [];
  if (messages.length <= MAX_TURNS * 2) return messages;
  return messages.slice(-MAX_TURNS * 2);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "";
    if (origin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { error: "Origin not allowed" },
        { status: 403, headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN } }
      );
    }

    const body = await req.json();
    const { messages = [], filters = [] } = body || {};
    const rolled = trimConversation(messages);

    const system = buildSystemPrompt(filters);

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        ...rolled.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content || ""),
        })),
      ],
      max_completion_tokens: 800,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "[No content returned by model]";

    return NextResponse.json(
      { text, model: MODEL },
      {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
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

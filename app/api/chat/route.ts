import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini"; // fallback model

const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com";

const GUIDELINE_NEUTRAL = `Neutral mode:
- Be clear, structured, impartial.
- Frame using recognized moral, legal, and policy frameworks.
- Identify uncertainties; avoid speculation.`;

const GUIDELINE_MINISTRY = `Ministry add-on:
- Offer pastoral counsel grounded in Scripture and Christian tradition.
- Emphasize humility, human dignity, and responsibility before God.`;

const GUIDELINE_GUIDANCE = `Guidance add-on:
- Red-team arguments for bias and failure modes.
- Provide risk registers, decision trees, and “next steps”.`;

function buildSystemPrompt(filters: string[]) {
  const parts = [GUIDELINE_NEUTRAL];
  if (filters?.includes("ministry")) parts.push(GUIDELINE_MINISTRY);
  if (filters?.includes("guidance")) parts.push(GUIDELINE_GUIDANCE);
  return parts.join("\n\n");
}

function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5;
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}

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

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "";
    if (origin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { error: `Origin not allowed: ${origin}` },
        { status: 403, headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN } }
      );
    }

    const body = await req.json();
    const { messages = [], filters = [] } = body || {};

    const rolled = trimConversation(messages);
    const system = buildSystemPrompt(filters);

    // Flatten conversation to plain string
    const transcript = rolled
      .map((m: any) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
      .join("\n");

    const fullPrompt =
      `System instructions:\n${system}\n\nConversation (last 5 turns, newest last):\n${transcript}\n\nAssistant:`;

    // ✅ Minimal string input
    const response = await client.responses.create({
      model: MODEL,
      input: fullPrompt,
      max_output_tokens: 800,
    });

    const text = response.output_text?.trim() || "[No reply from model]";

    return NextResponse.json(
      { text, model: MODEL, sources: [] },
      {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
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

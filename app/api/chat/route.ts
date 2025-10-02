// app/api/chat/route.ts (or wherever your Next Route Handler lives)

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/** ==== ENV / CONFIG ==== */
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini"; // keep your fallback

const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com";

/** ==== MODES / GUIDELINES ==== */
/** Neutral baseline: unbiased, structured, humble about uncertainty. */
const GUIDELINE_NEUTRAL = `NEUTRAL MODE
- Be clear, structured, and impartial.
- Use recognized moral, legal, policy, and practical frameworks when relevant.
- Identify uncertainty; avoid speculation and moral relativism.
- Plain, respectful tone; short paragraphs; no fluff.`;

/** Abrahamic ministry: God-rooted and inclusive across Torah → Gospels → Qur'an. */
const GUIDELINE_ABRAHAMIC = `ABRAHAMIC MINISTRY ADD-ON
- Root counsel in God (the Abrahamic tradition), drawing respectfully from:
  • the Torah/Tanakh (Hebrew Scriptures),
  • the New Testament (Gospels and apostolic writings),
  • the Qur'an and the Sunnah (as general moral guidance).
- Honor the continuous line of revelation (Abraham, Moses, Jesus, Muhammad — peace be upon them).
- Emphasize: human dignity, stewardship, mercy, justice, truthfulness, responsibility before God.
- When relevant, include short, accessible references (e.g., “Exodus 20”, “Matthew 5”, “Qur'an 5:8”).
- Avoid sectarian polemics; do not proselytize; use inclusive language (e.g., “people of faith,” “believers”).
- Pastoral sensitivity: acknowledge suffering, encourage prayer/reflection/community support.
- Do not issue detailed legal rulings in any single tradition (fiqh/halakha/canon law) unless explicitly asked; instead, point to qualified local clergy/scholars as needed.`;

/** Guidance add-on: structured decision help. */
const GUIDELINE_GUIDANCE = `GUIDANCE ADD-ON
- Red-team for bias and failure modes where appropriate.
- Offer a compact risk register (top 3–5 risks), a decision tree or simple options matrix, and clear next steps.
- Conclude with a short checklist users can act on immediately.`;

/** A tiny, predictable response scaffold so answers are consistent. */
const RESPONSE_FORMAT = `RESPONSE FORMAT
1) Brief Answer (2–4 sentences, plain language).
2) Rationale (bullet points; cite uncertainty if any).
3) Options / Next Steps (actionable bullets).
4) (If Abrahamic mode is active and appropriate) Relevant Scripture (1–3 brief references across the Abrahamic sources).`;

/** Optional global guardrails to prevent drift in tone/ethics. */
const HOUSE_RULES = `HOUSE RULES
- Always uphold human dignity; avoid contempt or stereotyping of any group.
- Be kind but candid; moral clarity over moral relativism.
- If medical, legal, or financial stakes are high, recommend consulting a qualified professional.
- If the user asks for strictly secular framing, comply (but stay ethical and respectful).`;

/** ==== PROMPT BUILDER ==== */
function buildSystemPrompt(filters: string[]) {
  const parts = [GUIDELINE_NEUTRAL, HOUSE_RULES, RESPONSE_FORMAT];

  // Back-compat: treat "ministry" as the inclusive Abrahamic mode
  const wantsAbrahamic =
    filters?.includes("abrahamic") || filters?.includes("ministry");
  if (wantsAbrahamic) parts.push(GUIDELINE_ABRAHAMIC);

  if (filters?.includes("guidance")) parts.push(GUIDELINE_GUIDANCE);

  return parts.join("\n\n");
}

/** Keep transcripts short to control token use and keep the model on track. */
function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5; // last 5 user+assistant exchanges
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}

/** ==== CORS for OPTIONS ==== */
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

/** ==== POST ==== */
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

    // Flatten to a simple transcript the way you had it.
    const transcript = rolled
      .map((m: any) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
      .join("\n");

    const fullPrompt =
      `System instructions:\n${system}\n\n` +
      `Conversation (last ${Math.floor(rolled.length / 2)} turns, newest last):\n` +
      `${transcript}\n\nAssistant:`;

    // Minimal string input (keep your approach)
    const response = await client.responses.create({
      model: MODEL,
      input: fullPrompt,
      max_output_tokens: 800,
    });

    const text = (response as any).output_text?.trim() || "[No reply from model]";

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

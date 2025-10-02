// app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/* ========= ENV ========= */
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com";
const DEBUG_PROMPTS = process.env.DEBUG_PROMPTS === "true";

/* ========= MODES / GUIDELINES ========= */

// Neutral baseline
const GUIDELINE_NEUTRAL = `NEUTRAL MODE
- Be clear, structured, and impartial.
- Use recognized moral, legal, policy, and practical frameworks when relevant.
- Identify uncertainty; avoid speculation and moral relativism.
- Plain, respectful tone; short paragraphs; no fluff.`;

// Abrahamic / God-rooted (replaces "Ministry")
const GUIDELINE_ABRAHAMIC = `ABRAHAMIC COUNSEL ADD-ON
- Root counsel in God across the Abrahamic tradition, drawing respectfully from:
  • Torah/Tanakh (Hebrew Scriptures),
  • New Testament (Gospels and apostolic writings),
  • Qur'an (with Sunnah as general moral guidance).
- Honor the continuity of revelation (Abraham, Moses, Jesus, Muhammad — peace be upon them).
- Emphasize human dignity, stewardship, mercy, justice, truthfulness, responsibility before God.
- When relevant, include 1–3 brief references (e.g., "Exodus 20", "Matthew 5", "Qur'an 4:135").
- Avoid sectarian polemics; do not proselytize; inclusive language ("people of faith," "believers").
- Pastoral sensitivity; acknowledge suffering; encourage prayer/reflection/community.
- Do not issue detailed legal rulings in any single tradition unless explicitly asked; instead, recommend qualified local clergy/scholars when appropriate.`;

// Decision support
const GUIDELINE_GUIDANCE = `GUIDANCE ADD-ON
- Red-team briefly for bias/failure modes where appropriate.
- Offer a compact risk register (top 3–5), a simple options matrix/decision path, and clear next steps.
- End with a short actionable checklist.`;

// Predictable output shape — with strict Section 4 behavior
const RESPONSE_FORMAT = `RESPONSE FORMAT
1) Brief Answer (2–4 sentences, plain language).
2) Rationale (bullet points; note uncertainty if any).
3) Options / Next Steps (actionable bullets).
4) Relevant Scripture:
   - If Abrahamic add-on is active AND user has not asked for secular framing: PROVIDE 1–3 concise references across Torah/Tanakh, Gospels, Qur'an.
   - If NOT active or the user asked for secular framing: OMIT this section entirely. Do NOT write "Not applicable."`;

// House rules
const HOUSE_RULES = `HOUSE RULES
- Always uphold human dignity; avoid contempt or stereotyping of any group.
- Be kind but candid; moral clarity over moral relativism.
- If stakes are medical, legal, or financial, recommend consulting a qualified professional.
- If the user requests "secular framing," comply and omit religious references.`;

/* ========= HELPERS ========= */

function normalizeFilters(filters: unknown): string[] {
  if (!Array.isArray(filters)) return [];
  return filters
    .map((f) => String(f ?? "").toLowerCase().trim())
    .filter(Boolean);
}

// Build system prompt from filters
function buildSystemPrompt(filters: string[], userWantsSecular: boolean) {
  const parts = [GUIDELINE_NEUTRAL, HOUSE_RULES, RESPONSE_FORMAT];

  // Back-compat: "ministry" maps to Abrahamic
  const wantsAbrahamic =
    filters.includes("abrahamic") || filters.includes("ministry");

  if (wantsAbrahamic && !userWantsSecular) parts.push(GUIDELINE_ABRAHAMIC);
  if (filters.includes("guidance")) parts.push(GUIDELINE_GUIDANCE);

  return { prompt: parts.join("\n\n"), wantsAbrahamic };
}

// Keep convo short
function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5; // last 5 exchanges
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}

// Detect if user explicitly asked for secular framing in recent turns
function wantsSecular(messages: Array<{ role: string; content: string }>) {
  const recent = messages.slice(-6).map((m) => m.content.toLowerCase()).join(" ");
  return /secular framing|secular only|no scripture|no religious|keep it secular/.test(
    recent
  );
}

/* ========= CORS (OPTIONS) ========= */
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

/* ========= POST ========= */
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
    const rawFilters = body?.filters ?? [];
    const filters = normalizeFilters(rawFilters); // <-- normalize here
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const rolled = trimConversation(messages);
    const userAskedForSecular = wantsSecular(rolled);

    const { prompt: system, wantsAbrahamic } = buildSystemPrompt(
      filters,
      userAskedForSecular
    );

    // Flatten conversation
    const transcript = rolled
      .map((m: any) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
      .join("\n");

    const fullPrompt =
      `System instructions:\n${system}\n\n` +
      `Conversation (last ${Math.floor(rolled.length / 2)} turns, newest last):\n` +
      `${transcript}\n\nAssistant:`;

    // Call model (string input)
    const response = await client.responses.create({
      model: MODEL,
      input: fullPrompt,
      max_output_tokens: 800,
    });

    const text = (response as any).output_text?.trim() || "[No reply from model]";

    // Optional debug echo to help you verify parsed filters while testing
    const debug = DEBUG_PROMPTS
      ? { parsedFilters: filters, wantsAbrahamic, userAskedForSecular, model: MODEL }
      : undefined;

    return NextResponse.json(
      { text, model: MODEL, sources: [], debug },
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

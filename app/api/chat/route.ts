// app/api/chat/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

/* ========= CONFIG ========= */
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const REQUEST_TIMEOUT_MS = 20_000;
const ORIGIN_LIST = (process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

/* ========= GUIDELINES ========= */
const GUIDELINE_NEUTRAL = `NEUTRAL MODE
- Be clear, structured, and impartial.
- Use recognized moral, legal, policy, and practical frameworks when relevant.
- Identify uncertainty; avoid speculation and moral relativism.
- Plain, respectful tone; short paragraphs; no fluff.`;

const GUIDELINE_ABRAHAMIC = `ABRAHAMIC COUNSEL ADD-ON
- Root counsel in God across the Abrahamic tradition, drawing respectfully from:
  • Torah/Tanakh (Hebrew Scriptures),
  • New Testament (Gospels and apostolic writings),
  • Qur'an (with Sunnah as general moral guidance).
- Honor the continuity of revelation (Abraham, Moses, Jesus, Muhammad — peace be upon them).
- Emphasize human dignity, stewardship, mercy, justice, truthfulness, responsibility before God.
- When relevant, include brief references (e.g., "Exodus 20", "Matthew 5", "Qur'an 4:135").
- Avoid sectarian polemics; do not proselytize; inclusive language ("people of faith," "believers").
- Pastoral sensitivity; acknowledge suffering; encourage prayer/reflection/community.
- Do not issue detailed legal rulings in any single tradition unless explicitly asked; instead, recommend qualified local clergy/scholars when appropriate.`;

const GUIDELINE_GUIDANCE = `GUIDANCE ADD-ON
- Red-team briefly for bias/failure modes where appropriate.
- Offer a compact risk register (top 3–5), a simple options matrix/decision path, and clear next steps.
- End with a short actionable checklist.`;

const RESPONSE_FORMAT = `RESPONSE FORMAT
1) Brief Answer (2–4 sentences, plain language).
2) Rationale (bullet points; note uncertainty if any).
3) Options / Next Steps (actionable bullets).
4) Relevant Scripture:
   - If Abrahamic add-on is ACTIVE and user has NOT asked for secular framing: PROVIDE 1–3 concise references across Torah/Tanakh, Gospels, Qur'an.
   - If NOT active or the user asked for secular framing: OMIT this section entirely. Do NOT write "Not applicable" or placeholders.`;

const ABRAHAMIC_MUST = `MANDATE (only when Abrahamic add-on is active and user has not asked for secular framing)
- You MUST include Section 4 with at least ONE concise reference (e.g., "Leviticus 19:18", "Matthew 5:37", "Qur'an 4:135").
- Keep references brief; no long quotations; no more than three references.
- Do NOT output any text like "Not applicable" in place of Section 4.`;

const OUTPUT_CHECK = `OUTPUT SELF-CHECK
- If Abrahamic add-on is active and user has not asked for secular framing, verify that your final message contains Section 4 with 1–3 concise references.
- If it does not, regenerate succinctly to include it, keeping Sections 1–3 intact.`;

const HOUSE_RULES = `HOUSE RULES
- Always uphold human dignity; avoid contempt or stereotyping of any group.
- Be kind but candid; moral clarity over moral relativism.
- If stakes are medical, legal, or financial, recommend consulting a qualified professional.
- If the user requests "secular framing," comply and omit religious references.`;

/* ========= HELPERS ========= */
function normalizeFilters(filters: unknown): string[] {
  if (!Array.isArray(filters)) return [];
  return filters.map(f => String(f ?? "").toLowerCase().trim()).filter(Boolean);
}
function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5;
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}
function wantsSecular(messages: Array<{ role: string; content: string }>) {
  const text = messages.slice(-6).map(m => m.content).join(" ").toLowerCase();
  return /\bsecular framing\b|\bsecular only\b|\bno scripture\b|\bno religious\b|\bkeep it secular\b/.test(text);
}
function buildSystemPrompt(filters: string[], userWantsSecular: boolean) {
  const parts = [GUIDELINE_NEUTRAL, HOUSE_RULES, RESPONSE_FORMAT, OUTPUT_CHECK];
  const wantsAbrahamic = filters.includes("abrahamic") || filters.includes("ministry");
  if (wantsAbrahamic && !userWantsSecular) parts.push(GUIDELINE_ABRAHAMIC, ABRAHAMIC_MUST);
  if (filters.includes("guidance")) parts.push(GUIDELINE_GUIDANCE);
  return { prompt: parts.join("\n\n"), wantsAbrahamic };
}
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Request timed out")), ms);
    p.then(v => { clearTimeout(id); resolve(v); })
     .catch(e => { clearTimeout(id); reject(e); });
  });
}
function pickAllowed(origin: string | null) {
  if (!origin) return null;
  return ORIGIN_LIST.includes(origin) ? origin : null;
}
function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

/* ========= LAZY OPENAI CLIENT ========= */
import type OpenAI from "openai";
let _client: OpenAI | null = null;
async function getClient(): Promise<OpenAI> {
  if (!_client) {
    const { default: OpenAI } = await import("openai");
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _client;
}

/* ========= CORS (OPTIONS) ========= */
export async function OPTIONS(req: NextRequest) {
  const origin = pickAllowed(req.headers.get("origin"));
  if (!origin) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/* ========= POST ========= */
export async function POST(req: NextRequest) {
  try {
    const origin = pickAllowed(req.headers.get("origin"));
    if (!origin) {
      return NextResponse.json(
        { error: `Origin not allowed`, allowed: ORIGIN_LIST },
        { status: 403 }
      );
    }

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const filters = normalizeFilters(body?.filters ?? []);
    const rolled = trimConversation(messages);
    const userAskedForSecular = wantsSecular(rolled);
    const { prompt: system } = buildSystemPrompt(filters, userAskedForSecular);

    const transcript = rolled
      .map((m: any) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
      .join("\n");

    const fullPrompt =
      `System instructions:\n${system}\n\n` +
      `Conversation (last ${Math.floor(rolled.length / 2)} turns, newest last):\n` +
      `${transcript}\n\nAssistant:`;

    const openai = await getClient();
    const resp = await withTimeout(
      openai.responses.create({
        model: MODEL,
        input: fullPrompt,
        max_output_tokens: 800,
      }),
      REQUEST_TIMEOUT_MS
    );

    const text = (resp as any).output_text?.trim() || "[No reply from model]";

    return NextResponse.json(
      { text, model: MODEL, sources: [] },
      { headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    const msg = err?.message === "Request timed out"
      ? "⚠️ Connection timed out. Please try again."
      : (err?.message || String(err));
    const origin = pickAllowed(req.headers.get("origin")) || ORIGIN_LIST[0];

    return NextResponse.json(
      { error: msg },
      { status: err?.message === "Request timed out" ? 504 : 500, headers: corsHeaders(origin) }
    );
  }
}


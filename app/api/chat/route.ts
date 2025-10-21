// app/api/chat/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type OpenAI from 'openai';
import { getOpenAI } from '@/lib/openai';
import { routeMode } from '@/core/mode-router';

/* ========= CONFIG ========= */
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const REQUEST_TIMEOUT_MS = 20_000;

// Only these exact origins are allowed
const ALLOWED_ORIGINS = [
  'https://moralclarity.ai',
  'https://www.moralclarity.ai',
  'https://studio.moralclarity.ai',
];

/* ========= GUIDELINES (brief-by-default) ========= */
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

const HOUSE_RULES = `HOUSE RULES
- Always uphold human dignity; avoid contempt or stereotyping of any group.
- Be kind but candid; moral clarity over moral relativism.
- If stakes are medical, legal, or financial, recommend consulting a qualified professional.
- If the user requests "secular framing," comply and omit religious references.`;

/* ========= STYLE CONTROLS ========= */
const STYLE_BRIEF = `STYLE (DEFAULT)
- Answer briefly (one short paragraph or 2–4 sentences).
- Do NOT include "Rationale", "Options/Next Steps", or "Scripture" sections unless explicitly requested by the user or activated by filters/mode.
- Be plain, respectful, and concrete.`;

const STYLE_EXPANDED = `STYLE (EXPANDED ON REQUEST)
- The user asked for more detail (e.g., "why", "explain", "rationale", "what next", "options").
- You may include short bullet lists for Rationale and Next Steps.
- Keep it compact; avoid boilerplate.`;

const STYLE_SCRIPTURE = `STYLE (SCRIPTURE ADD-ON)
- The user asked for faith framing OR Abrahamic mode is active and the user did not request secular framing.
- Provide 1–3 brief references (e.g., "Leviticus 19:18", "Matthew 5", "Qur'an 4:135") ONLY if relevant to the user’s ask.
- No long quotes. Avoid sectarian polemics. Pastoral, concise.`;

/* ========= HELPERS ========= */
function normalizeFilters(filters: unknown): string[] {
  if (!Array.isArray(filters)) return [];
  return filters.map(f => String(f ?? '').toLowerCase().trim()).filter(Boolean);
}

function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5; // 5 user+assistant pairs
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}

function wantsSecular(messages: Array<{ role: string; content: string }>) {
  const text = messages.slice(-6).map(m => m.content).join(' ').toLowerCase();
  return /\bsecular framing\b|\bsecular only\b|\bno scripture\b|\bno religious\b|\bkeep it secular\b/.test(text);
}

function wantsExpanded(messages: Array<{ role: string; content: string }>) {
  const text = messages.slice(-4).map(m => m.content).join(' ').toLowerCase();
  return /\bwhy\b|\bexplain\b|\brationale\b|\bnext steps\b|\bwhat next\b|\boptions\b|\bhow should i\b/.test(text);
}

function wantsScriptureExplicit(messages: Array<{ role: string; content: string }>) {
  const text = messages.slice(-6).map(m => m.content).join(' ').toLowerCase();
  return /\bscripture\b|\bverse\b|\bfaith framing\b|\babrahamic\b|\bbible\b|\bqur'?an\b|\btorah\b/.test(text);
}

function buildSystemPrompt(
  filters: string[],
  userWantsSecular: boolean,
  userWantsExpanded: boolean,
  userWantsScripture: boolean
) {
  const parts = [GUIDELINE_NEUTRAL, HOUSE_RULES, STYLE_BRIEF];

  const wantsAbrahamic = (filters.includes('abrahamic') || filters.includes('ministry')) && !userWantsSecular;
  const activateScripture = (wantsAbrahamic || userWantsScripture) && !userWantsSecular;

  if (wantsAbrahamic) parts.push(GUIDELINE_ABRAHAMIC);
  if (filters.includes('guidance')) parts.push(GUIDELINE_GUIDANCE);
  if (userWantsExpanded) parts.push(STYLE_EXPANDED);
  if (activateScripture) parts.push(STYLE_SCRIPTURE);

  return { prompt: parts.join('\n\n'), wantsAbrahamic, wantsScripture: activateScripture };
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('Request timed out')), ms);
    p.then(v => { clearTimeout(id); resolve(v); })
     .catch(e => { clearTimeout(id); reject(e); });
  });
}

/* ========= CORS ========= */
function pickAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;       // same-origin
  return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Context-Id, X-Last-Mode');
  h.set('Access-Control-Max-Age', '86400');
  if (origin) h.set('Access-Control-Allow-Origin', origin);
  return h;
}

function headersToRecord(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => { out[k] = v; });
  return out;
}

/* ========= HEALTHCHECK ========= */
export async function GET(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
  return NextResponse.json({ ok: true, model: MODEL }, { headers: corsHeaders(origin) });
}

/* ========= OPTIONS (preflight) ========= */
export async function OPTIONS(req: NextRequest) {
  const reqOrigin = req.headers.get('origin');
  const origin = pickAllowedOrigin(reqOrigin);
  console.log('[CORS preflight] Origin:', reqOrigin, '→ allowed:', Boolean(origin));
  // If not allowed, still return 204 with Vary/Allow headers but without ACAO.
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/* ========= POST ========= */
export async function POST(req: NextRequest) {
  try {
    const reqOrigin = req.headers.get('origin');
    const echoOrigin = pickAllowedOrigin(reqOrigin);
    const sameOrNoOrigin = !reqOrigin;

    if (!echoOrigin && !sameOrNoOrigin) {
      return NextResponse.json(
        { error: 'Origin not allowed', allowed: ALLOWED_ORIGINS },
        { status: 403, headers: corsHeaders(null) }
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const filters = normalizeFilters(body?.filters ?? []);
    const wantStream = !!body?.stream;

    const rolled = trimConversation(messages);
    const userAskedForSecular = wantsSecular(rolled);
    const userAskedForExpanded = wantsExpanded(rolled);
    const userAskedForScripture = wantsScriptureExplicit(rolled);

    const lastUser = [...rolled].reverse().find(m => m.role?.toLowerCase() === 'user')?.content || '';
    const lastModeHeader = req.headers.get('x-last-mode');
    const route = routeMode(lastUser, { lastMode: lastModeHeader as any });

    const effectiveFilters =
      filters.length ? filters :
      route.mode === 'Guidance' ? ['guidance'] :
      route.mode === 'Ministry' ? ['abrahamic', 'ministry'] : [];

    const { prompt: system } = buildSystemPrompt(
      effectiveFilters,
      userAskedForSecular,
      userAskedForExpanded,
      userAskedForScripture
    );

    const openai: OpenAI = await getOpenAI();

    // ===== Non-stream (Responses API) =====
    if (!wantStream) {
      const resp = await withTimeout(
        openai.responses.create({
          model: MODEL,
          input: system + '\n\n' + rolled.map(m => `${m.role}: ${m.content}`).join('\n'),
          max_output_tokens: 800,
        }),
        REQUEST_TIMEOUT_MS
      );

      const text = (resp as any).output_text?.trim() || '[No reply from model]';

      return NextResponse.json(
        { text, model: MODEL, mode: route.mode, confidence: route.confidence, filters: effectiveFilters },
        { headers: corsHeaders(echoOrigin) }
      );
    }

    // ===== Stream (SSE via Chat Completions) =====
    const apiKey = process.env.OPENAI_API_KEY || '';
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          ...rolled.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        ],
      }),
    });

    if (!r.ok || !r.body) {
      const t = await r.text().catch(() => '');
      return new NextResponse(`Model error: ${r.status} ${t}`, { status: 500, headers: corsHeaders(echoOrigin) });
    }

    return new NextResponse(r.body as any, {
      headers: {
        ...headersToRecord(corsHeaders(echoOrigin)),
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err: any) {
    const echoOrigin = pickAllowedOrigin(req.headers.get('origin'));
    const msg = err?.message === 'Request timed out'
      ? '⚠️ Connection timed out. Please try again.'
      : err?.message || String(err);

    return NextResponse.json({ error: msg }, {
      status: err?.message === 'Request timed out' ? 504 : 500,
      headers: corsHeaders(echoOrigin),
    });
  }
}

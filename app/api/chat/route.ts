// app/api/chat/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type OpenAI from 'openai';
import { getOpenAI } from '@/lib/openai';
import { routeMode } from '@/core/mode-router';

/* ========= MODEL / TIMEOUT ========= */
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const REQUEST_TIMEOUT_MS = 20_000;

/* ========= ORIGINS ========= */
const ALLOWED_ORIGINS = [
  'https://moralclarity.ai',
  'https://www.moralclarity.ai',
  'https://studio.moralclarity.ai',
];

/* ========= SOLACE (IDENTITY) ========= */
const SOLACE_NAME = 'Solace';

/* ========= GUIDELINES ========= */
const HOUSE_RULES = `HOUSE RULES
- You are ${SOLACE_NAME}, a steady, compassionate presence. Warmth without sentimentality; conviction without ego.
- Always uphold human dignity; avoid contempt or stereotyping of any group.
- Be kind but candid; moral clarity over moral relativism.
- If stakes are medical, legal, or financial, recommend consulting a qualified professional.
- If the user requests "secular framing," comply and omit religious references.`;

const GUIDELINE_NEUTRAL = `NEUTRAL MODE BASELINE
- Be clear, structured, and impartial.
- Use recognized moral, legal, policy, and practical frameworks when relevant.
- Identify uncertainty; avoid speculation.
- Plain, respectful tone; short paragraphs; no fluff.`;

const GUIDELINE_ABRAHAMIC = `ABRAHAMIC COUNSEL LAYER
- Root counsel in God across the Abrahamic tradition, drawing respectfully from:
  • Torah/Tanakh (Hebrew Scriptures),
  • New Testament (Gospels and apostolic writings),
  • Qur'an (with Sunnah as general moral guidance).
- Honor the continuity of revelation (Abraham, Moses, Jesus, Muhammad — peace be upon them).
- Emphasize human dignity, stewardship, mercy, justice, truthfulness, responsibility before God.
- Avoid sectarian polemics; do not proselytize; inclusive language ("people of faith," "believers").
- Pastoral sensitivity; acknowledge suffering; encourage reflection/prayer/community.
- Do not issue detailed legal rulings in any single tradition unless explicitly asked; recommend qualified local clergy/scholars when appropriate.`;

const GUIDELINE_GUIDANCE = `GUIDANCE ADD-ON
- Briefly red-team the plan if stakes are high.
- Offer a compact risk register (top 3–5) and a simple options matrix/decision path when asked.
- End with a short actionable checklist when the user explicitly requests steps.`;

const RESPONSE_FORMAT = `RESPONSE FORMAT (DEFAULT)
- Default to a single "Brief Answer" (2–5 sentences, plain language).
- Include "Rationale" and/or "Next Steps" ONLY IF the user explicitly asks for them (e.g., "why", "explain", "give steps", "how do I proceed").
- Keep paragraphs short; avoid verbosity.`;

/* ========= SCRIPTURE POLICY (DYNAMIC) =========
   Gentle seeding when:
   - Abrahamic layer is active AND
   - The first substantive turn is moral/emotional (hope, fear, loss, guilt, forgiveness, justice, etc.)
   Otherwise: weave 1–2 short refs later only when relevant.
*/
function scripturePolicyText(opts: {
  wantsAbrahamic: boolean;
  forceFirstTurnSeeding: boolean;
  userAskedForSecular: boolean;
}) {
  const base =
    `SCRIPTURE POLICY\n` +
    `- Use very short references only (e.g., "Exodus 20", "Matthew 5", "Qur'an 4:135"); no long quotes by default.\n` +
    `- Weave 1–2 references inline only when relevant; avoid overwhelming the user.\n`;

  if (!opts.wantsAbrahamic || opts.userAskedForSecular) {
    return base + `- Abrahamic references DISABLED due to secular framing or inactive Abrahamic layer. Do not include scripture.`;
  }

  if (opts.forceFirstTurnSeeding) {
    return (
      base +
      `- FIRST REAL TURN IS MORAL/EMOTIONAL: Provide ONE gentle reference (max 1–2) to anchor hope/justice/mercy.\n` +
      `- Subsequent turns: include references only when clearly helpful or requested.`
    );
  }

  return base + `- Include references only when clearly helpful or explicitly requested.`;
}

/* ========= HELPERS ========= */
function normalizeFilters(filters: unknown): string[] {
  if (!Array.isArray(filters)) return [];
  return filters.map((f) => String(f ?? '').toLowerCase().trim()).filter(Boolean);
}

function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5; // last 5 user+assistant pairs
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}

function wantsSecular(messages: Array<{ role: string; content: string }>) {
  const text = messages.slice(-6).map((m) => m.content).join(' ').toLowerCase();
  return /\bsecular framing\b|\bsecular only\b|\bno scripture\b|\bno religious\b|\bkeep it secular\b|\bstrictly secular\b/.test(
    text
  );
}

/** Detects if this is effectively the user's first substantive message in the thread. */
function isFirstRealTurn(messages: Array<{ role: string; content: string }>) {
  const userCount = messages.filter((m) => m.role?.toLowerCase() === 'user').length;
  const assistantCount = messages.filter((m) => m.role?.toLowerCase() === 'assistant').length;
  // First real back-and-forth if there's at most one user message and no assistant content yet,
  // or if total turns < 3.
  return userCount <= 1 || messages.length < 3 || assistantCount === 0;
}

/** Gentle emotional/moral cue detector for seeding references. */
function hasEmotionalOrMoralCue(text: string) {
  const t = text.toLowerCase();
  const emo = [
    'hope',
    'lost',
    'afraid',
    'fear',
    'anxious',
    'anxiety',
    'grief',
    'sad',
    'sorrow',
    'depressed',
    'stress',
    'overwhelmed',
    'lonely',
    'alone',
    'comfort',
    'forgive',
    'forgiveness',
    'guilt',
    'shame',
    'purpose',
    'meaning',
  ];
  const moral = [
    'right',
    'wrong',
    'unfair',
    'injustice',
    'justice',
    'truth',
    'honest',
    'dishonest',
    'integrity',
    'mercy',
    'compassion',
    'courage',
  ];
  const hit = (arr: string[]) => arr.some((w) => t.includes(w));
  return hit(emo) || hit(moral);
}

/** Build the full Solace system prompt. */
function buildSystemPrompt(
  filters: string[],
  userWantsSecular: boolean,
  messages: Array<{ role: string; content: string }>
) {
  const wantsAbrahamic = filters.includes('abrahamic') || filters.includes('ministry');
  const wantsGuidance = filters.includes('guidance');

  const firstUserText =
    [...messages].reverse().find((m) => m.role?.toLowerCase() === 'user')?.content ?? '';
  const firstTurn = isFirstRealTurn(messages);
  const moralOrEmo = hasEmotionalOrMoralCue(firstUserText);

  const forceFirstTurnSeeding = wantsAbrahamic && !userWantsSecular && firstTurn && moralOrEmo;

  const parts: string[] = [];
  parts.push(
    `IDENTITY\nYou are ${SOLACE_NAME} — a steady, principled presence. You listen first, then offer concise counsel with moral clarity.`,
    HOUSE_RULES,
    GUIDELINE_NEUTRAL,
    RESPONSE_FORMAT,
    scripturePolicyText({
      wantsAbrahamic,
      forceFirstTurnSeeding,
      userAskedForSecular: userWantsSecular,
    })
  );
  if (wantsAbrahamic && !userWantsSecular) parts.push(GUIDELINE_ABRAHAMIC);
  if (wantsGuidance) parts.push(GUIDELINE_GUIDANCE);

  return {
    prompt: parts.join('\n\n'),
    wantsAbrahamic,
    forceFirstTurnSeeding,
  };
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('Request timed out')), ms);
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}

/* ========= CORS ========= */
function pickAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null; // same-origin
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
  h.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

/* ========= HEALTHCHECK ========= */
export async function GET(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
  return NextResponse.json({ ok: true, model: MODEL, identity: SOLACE_NAME }, { headers: corsHeaders(origin) });
}

/* ========= OPTIONS (preflight) ========= */
export async function OPTIONS(req: NextRequest) {
  const reqOrigin = req.headers.get('origin');
  const origin = pickAllowedOrigin(reqOrigin);
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

    const lastUser = [...rolled].reverse().find((m) => m.role?.toLowerCase() === 'user')?.content || '';
    const lastModeHeader = req.headers.get('x-last-mode');
    const route = routeMode(lastUser, { lastMode: lastModeHeader as any });

    const effectiveFilters =
      filters.length
        ? filters
        : route.mode === 'Guidance'
        ? ['guidance']
        : route.mode === 'Ministry'
        ? ['abrahamic', 'ministry']
        : [];

    const { prompt: system } = buildSystemPrompt(effectiveFilters, userAskedForSecular, rolled);
    const openai: OpenAI = await getOpenAI();

    // Non-stream path using Responses API (fast)
    if (!wantStream) {
      const resp = await withTimeout(
        openai.responses.create({
          model: MODEL,
          input:
            system +
            '\n\n' +
            rolled
              .map((m) => `${m.role}: ${m.content}`)
              .join('\n'),
          max_output_tokens: 800,
        }),
        REQUEST_TIMEOUT_MS
      );

      const text = (resp as any).output_text?.trim() || '[No reply from model]';

      return NextResponse.json(
        { text, model: MODEL, identity: SOLACE_NAME, mode: route.mode, confidence: route.confidence, filters: effectiveFilters },
        { headers: corsHeaders(echoOrigin) }
      );
    }

    // Stream via Chat Completions API (SSE)
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
          ...rolled.map((m) => ({
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
    const msg =
      err?.message === 'Request timed out'
        ? '⚠️ Connection timed out. Please try again.'
        : err?.message || String(err);

    return NextResponse.json(
      { error: msg, identity: SOLACE_NAME },
      {
        status: err?.message === 'Request timed out' ? 504 : 500,
        headers: corsHeaders(echoOrigin),
      }
    );
  }
}

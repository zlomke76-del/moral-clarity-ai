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

const ALLOW = new Set([
  'https://www.moralclarity.ai',
  'https://moralclarity.ai',
  'https://studio.moralclarity.ai',
]);

/* ========= tiny CORS helper ========= */
function corsFor(req: NextRequest): Headers {
  const origin = req.headers.get('origin') || '';
  const allow = ALLOW.has(origin) ? origin : '*';          // we don’t use credentials, '*' is fine
  const h = new Headers();
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Origin', allow);
  h.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  h.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-Context-Id, X-Last-Mode'
  );
  h.set('Access-Control-Max-Age', '86400');
  return h;
}

/* ========= OPTIONS (preflight) ========= */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsFor(req) });
}

/* ========= HEALTHCHECK ========= */
export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: true, model: MODEL }, { headers: corsFor(req) });
}

/* ========= helpers ========= */
function normalizeFilters(filters: unknown): string[] {
  if (!Array.isArray(filters)) return [];
  return filters.map(f => String(f ?? '').toLowerCase().trim()).filter(Boolean);
}
function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5;
  const limit = MAX_TURNS * 2; // user+assistant
  return messages.length <= limit ? messages : messages.slice(-limit);
}
function wantsSecular(messages: Array<{ role: string; content: string }>) {
  const text = messages.slice(-6).map(m => m.content).join(' ').toLowerCase();
  return /\bsecular framing\b|\bsecular only\b|\bno scripture\b|\bno religious\b|\bkeep it secular\b/.test(text);
}
const GUIDELINE_NEUTRAL = `NEUTRAL MODE
- Be clear, structured, and impartial.
- Use recognized moral, legal, policy, and practical frameworks when relevant.
- Identify uncertainty; avoid speculation and moral relativism.
- Plain, respectful tone; short paragraphs; no fluff.`;
const GUIDELINE_ABRAHAMIC = `ABRAHAMIC COUNSEL ADD-ON
- Root counsel in God across the Abrahamic tradition...
(unchanged body here)`;
const GUIDELINE_GUIDANCE = `GUIDANCE ADD-ON
- Red-team briefly...`;
const RESPONSE_FORMAT = `RESPONSE FORMAT
1) Brief Answer...
(unchanged body here)`;
const ABRAHAMIC_MUST = `MANDATE
- You MUST include Section 4...`;
const OUTPUT_CHECK = `OUTPUT SELF-CHECK
- If Abrahamic add-on is active...`;
const HOUSE_RULES = `HOUSE RULES
- Always uphold human dignity...
(unchanged body here)`;

function buildSystemPrompt(filters: string[], userWantsSecular: boolean) {
  const parts = [GUIDELINE_NEUTRAL, HOUSE_RULES, RESPONSE_FORMAT, OUTPUT_CHECK];
  const wantsAbrahamic = filters.includes('abrahamic') || filters.includes('ministry');
  if (wantsAbrahamic && !userWantsSecular) parts.push(GUIDELINE_ABRAHAMIC, ABRAHAMIC_MUST);
  if (filters.includes('guidance')) parts.push(GUIDELINE_GUIDANCE);
  return { prompt: parts.join('\n\n'), wantsAbrahamic };
}
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('Request timed out')), ms);
    p.then(v => { clearTimeout(id); resolve(v); })
     .catch(e => { clearTimeout(id); reject(e); });
  });
}

/* ========= POST (JSON or SSE) ========= */
export async function POST(req: NextRequest) {
  const cors = corsFor(req);

  try {
    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const filters = normalizeFilters(body?.filters ?? []);
    const wantStream = !!body?.stream;

    const rolled = trimConversation(messages);
    const userAskedForSecular = wantsSecular(rolled);

    const lastUser = [...rolled].reverse().find(m => m.role?.toLowerCase() === 'user')?.content || '';
    const lastModeHeader = req.headers.get('x-last-mode');
    const route = routeMode(lastUser, { lastMode: lastModeHeader as any });

    const effectiveFilters =
      filters.length ? filters :
      route.mode === 'Guidance' ? ['guidance'] :
      route.mode === 'Ministry' ? ['abrahamic', 'ministry'] : [];

    const { prompt: system } = buildSystemPrompt(effectiveFilters, userAskedForSecular);
    const openai: OpenAI = await getOpenAI();

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
        { headers: cors }
      );
    }

    // --- Stream (SSE via OpenAI chat-completions) ---
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
          ...rolled.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
        ],
      }),
    });

    if (!r.ok || !r.body) {
      const t = await r.text().catch(() => '');
      return new NextResponse(`Model error: ${r.status} ${t}`, { status: 500, headers: cors });
    }

    return new NextResponse(r.body as any, {
      headers: {
        ...Object.fromEntries(cors.entries()),
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err: any) {
    const cors = corsFor(req);
    const msg = err?.message === 'Request timed out'
      ? '⚠️ Connection timed out. Please try again.'
      : err?.message || String(err);
    return NextResponse.json({ error: msg }, { status: err?.message === 'Request timed out' ? 504 : 500, headers: cors });
  }
}

// app/api/chat/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

import { getOpenAI } from '@/lib/openai';
import { runDeepResearch } from '@/lib/research';
import { logResearchSnapshot } from '@/lib/truth-ledger';
import { routeMode } from '@/core/mode-router';

/* ========= MEMORY ========= */
import {
  searchMemories,
  remember,
  getMemoryPack,
  maybeStoreEpisode,
} from '@/lib/memory';

/* ========= MCA CONFIG (defaults for user/workspace) ========= */
import { MCA_WORKSPACE_ID, MCA_USER_KEY } from '@/lib/mca-config';

/* ========= IMAGE GENERATION ========= */
import { generateImage } from '@/lib/chat/image-gen';

/* ========= NEWS → LEDGERS ========= */
import { logNewsBatchToLedgers } from '@/lib/news-ledger';

/* ========= ATTACHMENTS HELPER ========= */
import { buildAttachmentSection, type Attachment } from '@/lib/chat/attachments';

/* ========= MODEL / TIMEOUT ========= */
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const REQUEST_TIMEOUT_MS = 20_000;

/* ========= ORIGINS ========= */
const STATIC_ALLOWED_ORIGINS = [
  'https://moralclarity.ai',
  'https://www.moralclarity.ai',
  'https://studio.moralclarity.ai',
  'https://studio-founder.moralclarity.ai',
  'https://moralclarityai.com',
  'https://www.moralclarityai.com',
  'http://localhost:3000',
];

const ENV_ALLOWED_ORIGINS = (process.env.MCAI_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOWED_SET = new Set<string>([...STATIC_ALLOWED_ORIGINS, ...ENV_ALLOWED_ORIGINS]);

function hostIsAllowedWildcard(hostname: string) {
  return (
    /^([a-z0-9-]+\.)*moralclarity\.ai$/i.test(hostname) ||
    /^([a-z0-9-]+\.)*moralclarityai\.com$/i.test(hostname)
  );
}

function pickAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  try {
    if (ALLOWED_SET.has(origin)) return origin;
    const url = new URL(origin);
    if (hostIsAllowedWildcard(url.hostname)) return origin;
  } catch {
    // ignore
  }
  return null;
}

function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  h.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-Context-Id, X-Last-Mode, X-User-Key'
  );
  h.set('Access-Control-Max-Age', '86400');
  if (origin) h.set('Access-Control-Allow-Origin', origin);
  return h;
}

function headersToRecord(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => (out[k] = v));
  return out;
}

/* ========= SOLACE ========= */
const SOLACE_NAME = 'Solace';
const SOLACE_URL = process.env.SOLACE_API_URL || '';
const SOLACE_KEY = process.env.SOLACE_API_KEY || '';

async function solaceNonStream(payload: any) {
  const r = await fetch(SOLACE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SOLACE_KEY}` },
    body: JSON.stringify({ ...payload, stream: false }),
  });
  if (!r.ok) throw new Error(`Solace ${r.status}: ${await r.text().catch(() => '')}`);
  const ct = r.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const j = await r.json().catch(() => ({}));
    return String(j.text ?? j.output ?? j.data ?? '');
  }
  return await r.text();
}

async function solaceStream(payload: any) {
  const r = await fetch(SOLACE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SOLACE_KEY}` },
    body: JSON.stringify({ ...payload, stream: true }),
  });
  if (!r.ok || !r.body) throw new Error(`Solace ${r.status}: ${await r.text().catch(() => '')}`);
  return r.body as ReadableStream<Uint8Array>;
}

/* ========= GUIDELINES / PROMPTING ========= */
const HOUSE_RULES = `HOUSE RULES
- You are ${SOLACE_NAME}, a steady, compassionate presence. Warmth without sentimentality; conviction without ego.
- Always uphold human dignity; avoid contempt or stereotyping.
- Be kind but candid; moral clarity over relativism.
- If stakes are medical, legal, or financial, suggest qualified professionals.
- If the user requests "secular framing," omit religious references.`;

const GUIDELINE_NEUTRAL = `NEUTRAL MODE BASELINE
- Be clear, structured, impartial.
- Use recognized moral, legal, policy, and practical frameworks when relevant.
- Identify uncertainty; avoid speculation.
- Short paragraphs; no fluff.`;

const GUIDELINE_ABRAHAMIC = `ABRAHAMIC COUNSEL LAYER
- Root counsel in God across the Abrahamic tradition (Torah/Tanakh, New Testament, Qur'an).
- Emphasize dignity, stewardship, mercy, justice, truthfulness, responsibility before God.
- No sectarian polemics or proselytizing; use inclusive language.
- Avoid detailed legal rulings unless asked; recommend local clergy/scholars when appropriate.`;

const GUIDELINE_GUIDANCE = `GUIDANCE ADD-ON
- Brief red-team for high-stakes.
- Offer a compact risk register and options matrix when asked.
- Provide an actionable checklist when steps are requested.`;

const RESPONSE_FORMAT = `RESPONSE FORMAT
- Default: a single "Brief Answer" (2–5 sentences).
- Add "Rationale" / "Next Steps" only if asked.
- If a MEMORY PACK is present, prefer it over general disclaimers. On prompts like "What do you remember about me?", list the relevant memory items succinctly.`;

/* scripture policy */
function scripturePolicyText(opts: {
  wantsAbrahamic: boolean;
  forceFirstTurnSeeding: boolean;
  userAskedForSecular: boolean;
}) {
  const base =
    `SCRIPTURE POLICY
- Very short references only (e.g., "Exodus 20", "Matthew 5", "Qur'an 4:135"); no long quotes by default.
- Weave 1–2 references inline only when relevant.\n`;

  if (!opts.wantsAbrahamic || opts.userAskedForSecular)
    return base + `- Abrahamic references DISABLED due to secular framing/inactive layer.`;

  if (opts.forceFirstTurnSeeding)
    return base + `- FIRST TURN ONLY: allow ONE gentle anchor reference; later only when clearly helpful.`;

  return base + `- Include references only when clearly helpful or requested.`;
}

/* ========= Small helpers ========= */
function normalizeFilters(filters: unknown): string[] {
  if (!Array.isArray(filters)) return [];
  return filters.map((f) => String(f ?? '').toLowerCase().trim()).filter(Boolean);
}

function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5;
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}

function wantsSecular(messages: Array<{ role: string; content: string }>) {
  const text = messages.slice(-6).map((m) => m.content).join(' ').toLowerCase();
  return /\bsecular framing\b|\bsecular only\b|\bno scripture\b|\bno religious\b|\bkeep it secular\b|\bstrictly secular\b/.test(
    text
  );
}

/* NEW: detect when user is asking for an image (generation) */
function wantsImageGeneration(text: string) {
  const t = (text || '').toLowerCase().trim();
  if (!t) return false;
  return (
    t.startsWith('img:') ||
    t.includes('generate an image') ||
    t.includes('create an image') ||
    t.includes('make an image') ||
    t.includes('draw a diagram') ||
    t.includes('make a visual') ||
    t.includes('create a diagram') ||
    t.includes('design a diagram')
  );
}

function isFirstRealTurn(messages: Array<{ role: string; content: string }>) {
  const userCount = messages.filter((m) => m.role?.toLowerCase() === 'user').length;
  const assistantCount = messages.filter((m) => m.role?.toLowerCase() === 'assistant').length;
  return userCount <= 1 || messages.length < 3 || assistantCount === 0;
}

function hasEmotionalOrMoralCue(text: string) {
  const t = (text || '').toLowerCase();
  const emo = [
    'hope',
    'lost',
    'afraid',
    'fear',
    'anxious',
    'grief',
    'sad',
    'sorrow',
    'depressed',
    'stress',
    'overwhelmed',
    'lonely',
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

function buildSystemPrompt(
  filters: string[],
  userWantsSecular: boolean,
  messages: Array<{ role: string; content: string }>
) {
  const wantsAbrahamic = filters.includes('abrahamic') || filters.includes('ministry');
  const wantsGuidance = filters.includes('guidance');
  const lastUserText =
    [...messages].reverse().find((m) => m.role?.toLowerCase() === 'user')?.content ?? '';
  const firstTurn = isFirstRealTurn(messages);
  const forceFirstTurnSeeding =
    wantsAbrahamic && !userWantsSecular && firstTurn && hasEmotionalOrMoralCue(lastUserText);

  const today = new Date();
  const iso = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const year = iso.slice(0, 4);

  const TIME_ANCHOR = `TIME & CONTEXT
- Today's date is ${iso} (YYYY-MM-DD). Treat this as "now".
- If the user asks for the current year, answer with ${year}.
- If information depends on events after your training cutoff AND no WEB CONTEXT or RESEARCH CONTEXT or NEWS CONTEXT is provided, explicitly say that you do not have up-to-date information and DO NOT guess, invent headlines, or fabricate sources.
- When a WEB CONTEXT, RESEARCH CONTEXT, or NEWS CONTEXT section is present, rely on it for post-cutoff events.
- Never state that the current year is earlier than ${year}; that would be drift.`;

  const parts: string[] = [];
  parts.push(
    `IDENTITY
You are ${SOLACE_NAME} — a steady, principled presence. Listen first, then offer concise counsel with moral clarity.`,
    HOUSE_RULES,
    TIME_ANCHOR,
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

  return { prompt: parts.join('\n\n'), wantsAbrahamic, forceFirstTurnSeeding };
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

/* ========= URL & Deep Research helpers ========= */
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

function extractFirstUrl(text: string): string | null {
  if (!text) return null;
  const m = text.match(URL_REGEX);
  return m ? m[0] : null;
}

function wantsDeepResearch(text: string): boolean {
  const t = (text || '').toLowerCase();
  if (!t.trim()) return false;

  const keywords = [
    'deep research',
    'full research',
    'full analysis',
    'deep dive',
    'research this',
    'investigate this',
    'evaluate this website',
    'evaluate this site',
    'analyze this website',
    'analyze this site',
    'ux review',
    'seo review',
    'is this website good',
    'is this site good',
    'is this site legit',
    'is this website legit',
  ];
  if (keywords.some((k) => t.includes(k))) return true;

  if (URL_REGEX.test(text)) return true;

  return false;
}

/* ========= Generic news question helper ========= */
function looksLikeGenericNewsQuestion(text: string): boolean {
  const t = (text || '').toLowerCase();
  if (!t.trim()) return false;

  const patterns = [
    /\bwhat\s+is\s+the\s+news\s+today\b/,
    /\bwhat'?s\s+the\s+news\s+today\b/,
    /\bnews\s+today\b/,
    /\btoday'?s\s+news\b/,
    /\btop\s+news\s+today\b/,
    /\btop\s+stories\s+today\b/,
    /\blatest\s+news\b/,
    /\bus\s+news\s+today\b/,
    /\blatest\s+u\.s\.\s+news\b/,
    /\bheadlines\s+today\b/,
  ];

  return patterns.some((rx) => rx.test(t));
}

/* ========= Memory helpers ========= */
function getUserKeyFromReq(req: NextRequest, body: any) {
  return req.headers.get('x-user-key') || body?.user_key || MCA_USER_KEY || 'guest';
}

function detectExplicitRemember(text: string) {
  if (!text) return null;
  const patterns = [
    /^\s*(?:please\s+)?remember(?:\s+that)?\s+(.+)$/i,
    /^\s*store\s+this:\s+(.+)$/i,
  ];
  for (const rx of patterns) {
    const m = text.match(rx);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

/* ========= SUPABASE for Neutral News Digest ========= */

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SUPABASE_SERVICE_ROLE_KEY = process.env
  .SUPABASE_SERVICE_ROLE_KEY as string | undefined;

function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('[chat] Supabase admin credentials not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

type SolaceDigestRow = {
  id: string;
  story_id: string | null;
  story_title: string | null;
  story_url: string | null;
  outlet: string | null;
  outlet_group: string | null;
  category: string | null;
  day_iso: string | null;

  neutral_summary: string | null;
  key_facts: unknown; // Supabase may send this as text / array
  context_background: string | null;
  stakeholder_positions: string | null;
  timeline: string | null;
  disputed_claims: string | null;
  omissions_detected: string | null;

  bias_language_score: number | null;
  bias_source_score: number | null;
  bias_framing_score: number | null;
  bias_context_score: number | null;
  bias_intent_score: number | null;
  pi_score: number | null;

  created_at: string | null;
  updated_at: string | null;
};

type SolaceDigestStory = {
  id: string;
  truth_fact_id: string | null; // not in view, kept for downstream compatibility
  story_id: string | null;
  title: string;
  url: string | null;
  outlet: string | null;
  outlet_group: string | null;
  category: string | null;

  neutral_summary: string;
  key_facts: string[];
  context_background: string;
  stakeholder_positions: string;
  timeline: string;
  disputed_claims: string;
  omissions_detected: string;

  bias_language_score: number | null;
  bias_source_score: number | null;
  bias_framing_score: number | null;
  bias_context_score: number | null;
  bias_intent_score: number | null;
  pi_score: number | null;

  notes: string | null; // not in view, kept as null
  created_at: string | null;
};

function coerceArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? '')).filter((v) => v.length > 0);
  }
  try {
    const parsed = JSON.parse(String(value));
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v ?? '')).filter((v) => v.length > 0);
    }
  } catch {
    // ignore parse errors; fall through
  }
  return [String(value)];
}

function coerceNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

function mapRowToStory(row: SolaceDigestRow): SolaceDigestStory {
  return {
    id: row.id,
    truth_fact_id: null, // view doesn’t expose this; kept for compatibility
    story_id: row.story_id,
    title: (row.story_title || '').trim() || '(untitled story)',
    url: row.story_url,
    outlet: row.outlet,
    outlet_group: row.outlet_group,
    category: row.category,

    neutral_summary: (row.neutral_summary || '').trim(),
    key_facts: coerceArray(row.key_facts),
    context_background: (row.context_background || '').trim(),
    stakeholder_positions: (row.stakeholder_positions || '').trim(),
    timeline: (row.timeline || '').trim(),
    disputed_claims: (row.disputed_claims || '').trim(),
    omissions_detected: (row.omissions_detected || '').trim(),

    bias_language_score: coerceNumber(row.bias_language_score),
    bias_source_score: coerceNumber(row.bias_source_score),
    bias_framing_score: coerceNumber(row.bias_framing_score),
    bias_context_score: coerceNumber(row.bias_context_score),
    bias_intent_score: coerceNumber(row.bias_intent_score),
    pi_score: coerceNumber(row.pi_score),

    notes: null,
    created_at: row.created_at,
  };
}

function coerceArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? '')).filter((v) => v.length > 0);
  }
  try {
    const parsed = JSON.parse(String(value));
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v ?? '')).filter((v) => v.length > 0);
    }
  } catch {
    // ignore
  }
  return [String(value)];
}

function coerceNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

function mapRowToStory(row: SolaceDigestRow): SolaceDigestStory {
  return {
    id: row.id,
    truth_fact_id: null,
    story_id: row.story_id,
    title: (row.story_title || '').trim() || '(untitled story)',
    url: row.story_url,
    outlet: row.outlet,
    outlet_group: row.outlet_group,
    category: row.category,

    neutral_summary: (row.neutral_summary || '').trim(),
    key_facts: coerceArray(row.key_facts),
    context_background: (row.context_background || '').trim(),
    stakeholder_positions: (row.stakeholder_positions || '').trim(),
    timeline: (row.timeline || '').trim(),
    disputed_claims: (row.disputed_claims || '').trim(),
    omissions_detected: (row.omissions_detected || '').trim(),

    bias_language_score: coerceNumber(row.bias_language_score),
    bias_source_score: coerceNumber(row.bias_source_score),
    bias_framing_score: coerceNumber(row.bias_framing_score),
    bias_context_score: coerceNumber(row.bias_context_score),
    bias_intent_score: coerceNumber(row.bias_intent_score),
    pi_score: coerceNumber(row.pi_score),

    notes: null,
    created_at: row.created_at,
  };
}

async function getSolaceNewsDigest(): Promise<SolaceDigestStory[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[chat] Neutral News Digest requested but Supabase admin env is missing.');
    return [];
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      // KEY WIRE-UP: use the scored digest view
      .from('solace_news_digest_view')
      .select('*')
      .order('story_date', { ascending: false })
      .order('pi_score', { ascending: false });

    if (error) {
      console.error('[chat] solace_news_digest_view error', error);
      return [];
    }

    const rows = (data || []) as SolaceDigestRow[];
    return rows.map(mapRowToStory);
  } catch (err) {
    console.error('[chat] getSolaceNewsDigest fatal', err);
    return [];
  }
}

/* ========= HEALTHCHECK ========= */
export async function GET(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
  const backend = SOLACE_URL && SOLACE_KEY ? 'solace' : 'openai';
  const memoryEnabled = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return NextResponse.json(
    { ok: true, model: MODEL, identity: SOLACE_NAME, backend, memoryEnabled },
    { headers: corsHeaders(origin) }
  );
}

/* ========= OPTIONS (CORS preflight) ========= */
export async function OPTIONS(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
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
        { error: 'Origin not allowed', allowed: Array.from(ALLOWED_SET) },
        { status: 403, headers: corsHeaders(null) }
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const rawFilters = normalizeFilters(body?.filters ?? []);
    const wantStream = !!body?.stream;
    const userId = body?.userId ?? null;
    const userName = body?.userName ?? null;

    const rolled = trimConversation(messages);
    const userAskedForSecular = wantsSecular(rolled);
    const lastUser =
      [...rolled].reverse().find((m) => m.role?.toLowerCase() === 'user')?.content || '';

    /* ===== IMAGE GENERATION FAST-PATH ===== */
    if (wantsImageGeneration(lastUser)) {
      const rawPrompt = lastUser.replace(/^img:\s*/i, '').trim() || lastUser;
      try {
        const imageUrl = await generateImage(rawPrompt);
        const text =
          `Here is your generated image based on your description:\n` +
          `${imageUrl}`;

        return NextResponse.json(
          {
            text,
            image_url: imageUrl,
            model: 'gpt-image-1',
            identity: SOLACE_NAME,
            mode: 'Image',
            confidence: 1,
            filters: rawFilters,
          },
          { headers: corsHeaders(echoOrigin) }
        );
      } catch (e: any) {
        const msg = e?.message || 'Image generation failed';
        return NextResponse.json(
          {
            text: `⚠️ Image generation error: ${msg}`,
            model: 'gpt-image-1',
            identity: SOLACE_NAME,
            mode: 'Image',
            confidence: 0,
            filters: rawFilters,
          },
          { headers: corsHeaders(echoOrigin) }
        );
      }
    }

    /* Route -> Guidance flag */
    const lastModeHeader = req.headers.get('x-last-mode');
    const route = routeMode(lastUser, { lastMode: lastModeHeader as any });

    /* Effective filters */
    const incoming = new Set(rawFilters);
    if (route.mode === 'Guidance') incoming.add('guidance');
    if (!userAskedForSecular) {
      incoming.add('ministry');
      incoming.add('abrahamic');
    }
    if (body?.ministry === false) {
      incoming.delete('ministry');
      incoming.delete('abrahamic');
    }
    const effectiveFilters = Array.from(incoming);

    const { prompt: baseSystem } = buildSystemPrompt(
      effectiveFilters,
      userAskedForSecular,
      rolled
    );

    /* ===== MEMORY: recall pack (scoped, episodic + factual) ===== */
    let userKey = getUserKeyFromReq(req, body);
    if (!userKey || userKey === 'guest') {
      userKey = `u_${crypto.randomUUID()}`;
    }
    const workspaceId: string = body?.workspace_id || MCA_WORKSPACE_ID;

    const memoryEnabled = Boolean(
      process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let hits: Array<any> = [];
    let memorySection = '';

    if (memoryEnabled) {
      try {
        const fallbackQuery =
          rolled
            .filter((m) => m.role === 'user')
            .map((m) => m.content)
            .slice(-3)
            .join('\n') || 'general';

        const explicitInTurns = rolled
          .filter((m) => m.role === 'user')
          .map((m) => m.content.match(/\bremember(?:\s+that)?\s+(.+)/i)?.[1])
          .filter(Boolean)
          .join(' ; ');

        const baseQuery = lastUser || fallbackQuery;
        const query = [baseQuery, explicitInTurns].filter(Boolean).join(' | ');

        // 1) Episodic + factual memory pack for Solace system prompt
        const pack = await getMemoryPack(userKey, query, {
          factsLimit: 8,
          episodesLimit: 6,
        });

        memorySection =
          `\n\nMEMORY PACK (private, user-scoped)\nUse these stable facts/preferences and key episodes **only if relevant**:\n` +
          (pack || '• (none)');

        // 2) Raw factual hits kept only for "what do you remember" echo
        hits = await searchMemories(userKey, query, 8);
      } catch (err) {
        console.error('[chat] memory recall failed', err);
        memorySection = '';
        hits = [];
      }
    }

    /* ===== Memory Echo fast path ===== */
    const askedWhatYouRemember = /what\s+do\s+you\s+remember\b|remember\s+about\s+me\b/i.test(
      lastUser
    );
    if (askedWhatYouRemember && hits && hits.length) {
      const top = hits
        .slice(0, 10)
        .map((m: any, i: number) => `${i + 1}. ${m.content}`)
        .join('\n');
      const text = `Here’s what I have noted:\n${top}`;
      return NextResponse.json(
        {
          text,
          model: 'memory-echo',
          identity: SOLACE_NAME,
          mode: route.mode,
          confidence: route.confidence,
          filters: effectiveFilters,
        },
        { headers: corsHeaders(echoOrigin) }
      );
    }

    /* ===== WEB / RESEARCH FLAGS ===== */

    const wantsFresh =
      /\b(what('?s)?\s+the\s+news(\s+today)?|news\s+today|today('?s)?\s+news|latest\s+news|top\s+news|top\s+stories(\s+today)?|breaking\s+news|news\s+headlines|headlines\s+today)\b/i.test(
        lastUser.toLowerCase()
      );

    const wantsGenericNews = looksLikeGenericNewsQuestion(lastUser);

    const rawWebFlag =
      process.env.NEXT_PUBLIC_OPENAI_WEB_ENABLED_flag ??
      process.env.OPENAI_WEB_ENABLED_flag ??
      '';

    const webFlag =
      typeof rawWebFlag === 'string'
        ? rawWebFlag.length > 0 && !/^0|false$/i.test(rawWebFlag)
        : !!rawWebFlag;

    /* ===== DEEP RESEARCH (Tavily lives only here now) ===== */
    let researchSection = '';
    let hasResearchContext = false;

    try {
      const wantsDeep = wantsDeepResearch(lastUser);
      const urlInUser = extractFirstUrl(lastUser);

      if (webFlag && (wantsDeep || urlInUser)) {
        const pack = await runDeepResearch(lastUser);

        try {
          await logResearchSnapshot({
            workspaceId,
            userKey,
            userId,
            query: lastUser,
            researchPack: pack,
          });
        } catch (err) {
          console.error('[truth-ledger] logResearchSnapshot failed (non-fatal)', err);
        }

        const bulletsText = pack.bullets?.length
          ? pack.bullets.map((b: string) => `• ${b}`).join('\n')
          : '• (no external sources were found for this query)';

        const websiteSnippet = pack.urlTextSnippet
          ? `\n\nWEBSITE TEXT SNAPSHOT (truncated)\n"""${pack.urlTextSnippet}"""`
          : '';

        const clarificationHint =
          urlInUser && !wantsDeep
            ? `\n\nNOTE FOR ASSISTANT\n- The user shared a URL (${urlInUser}) but did not clearly state what aspect they want evaluated (design/UX, messaging/clarity, SEO/traffic, trustworthiness, etc.). Before giving a long evaluation, briefly ask which of these they care about most, then tailor your analysis.`
            : '';

        researchSection =
          `\n\nRESEARCH CONTEXT\n- This section aggregates deeper web research (multiple searches and, when applicable, a direct fetch of the target website).\n\nSOURCES\n${bulletsText}${websiteSnippet}${clarificationHint}\n\nGuidance:\n- Use this RESEARCH CONTEXT for deeper analysis, comparisons, and website evaluations.\n- When you reference specific sources from this section, use [R1], [R2], etc., matching the labels in the bullet list.\n- Do NOT claim you lack internet access when this section is present.`;

        hasResearchContext = true;
      }
    } catch (err) {
      console.error('runDeepResearch failed:', err);
    }

    /* ===== NEWS CONTEXT: Neutral News Digest ONLY ===== */
    let newsSection = '';
    let hasNewsContext = false;
    let newsStoriesForLedger: any[] | null = null;

    if (wantsGenericNews || wantsFresh) {
      try {
        const stories = await getSolaceNewsDigest();
        newsStoriesForLedger = stories;

        if (stories.length) {
          hasNewsContext = true;

          const lines = stories
            .slice(0, 8)
            .map((s, i) => {
              const label = `D${i + 1}`;
              const srcParts = [];
              if (s.outlet) srcParts.push(s.outlet);
              if (s.outlet_group) srcParts.push(`group: ${s.outlet_group}`);
              const src = srcParts.length ? ` — ${srcParts.join(' / ')}` : '';
              const url = s.url ? ` — ${s.url}` : '';
              const summary = s.neutral_summary || '';
              return `• [${label}] ${s.title}${src}${url}\n${summary}`;
            })
            .join('\n\n');

          newsSection =
            `\n\nNEWS CONTEXT (Neutral News Digest)\n` +
            `${lines}\n\nGuidance:\n` +
            `- Use ONLY this NEWS CONTEXT when answering generic questions like "what is the news today" or "top news today".\n` +
            `- Do NOT invent additional headlines or stories beyond what appears here.\n` +
            `- By default, return 2–4 stories. For each story, write a neutral, fact-focused summary, unless the user explicitly asks for a different length.\n` +
            `- Always include direct links (URLs) in your answer when you reference a specific story.\n` +
            `- If bias scores (bias_intent_score, pi_score) are mentioned, treat them as authoritative and DO NOT rescore.`;
        } else {
          newsSection =
            `\n\nNEWS CONTEXT (Neutral News Digest)\n` +
            `• (no pre-scored neutral news stories are currently available in the digest)\n\nGuidance:\n` +
            `- Clearly tell the user that the Neutral News Digest is empty for now.\n` +
            `- Do NOT fetch or invent external headlines.\n` +
            `- Invite the user to try again later when new stories are processed.`;
        }
      } catch (err) {
        console.error('[chat] Neutral News Digest block failed', err);
      }
    }

    /* ===== Attachments digest (delegated) ===== */
    let attachmentSection = '';
    try {
      const atts = (Array.isArray(body?.attachments) ? body.attachments : []) as Attachment[];
      if (atts.length) {
        attachmentSection = await buildAttachmentSection(atts);
      }
    } catch {
      attachmentSection = '';
    }

    /* ===== REAL-TIME CONTEXT ASSERTION ===== */
    const webAssertion =
      hasResearchContext || hasNewsContext
        ? `\n\nREAL-TIME CONTEXT\n- You DO have recent or web-derived context above (NEWS CONTEXT and/or RESEARCH CONTEXT). Do NOT say you cannot provide real-time updates or that you lack internet access.\n- Synthesize a brief, accurate answer using that context, and include bracketed refs like [D1], [D2] or [R1], [R2] when you rely on specific items.`
        : '';

    const system =
      baseSystem + memorySection + newsSection + researchSection + webAssertion;

    /* ===== News → Truth + Neutrality ledgers (digest-based) ===== */
    if (hasNewsContext && newsStoriesForLedger && newsStoriesForLedger.length) {
      try {
        await logNewsBatchToLedgers({
          workspaceId,
          userKey,
          userId,
          query: lastUser,
          cacheStories: newsStoriesForLedger,
        });
      } catch (err) {
        console.error('[news-ledger] batch logging failed (non-fatal)', err);
      }
    }

    /* ===== Explicit "remember ..." capture ===== */
    if (memoryEnabled) {
      const explicit = detectExplicitRemember(lastUser);
      if (explicit) {
        try {
          await (remember as any)({
            workspace_id: workspaceId,
            user_key: userKey,
            content: explicit,
            purpose: 'fact',
            title: '',
          });
          const ack = `Got it — I'll remember that: ${explicit}`;
          if (!wantStream) {
            return NextResponse.json(
              {
                text: ack,
                model: 'memory',
                identity: SOLACE_NAME,
                mode: route.mode,
                confidence: route.confidence,
                filters: effectiveFilters,
              },
              { headers: corsHeaders(echoOrigin) }
            );
          } else {
            const enc = new TextEncoder();
            const stream = new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(enc.encode(ack));
                controller.close();
              },
            });
            return new NextResponse(stream as any, {
              headers: {
                ...headersToRecord(corsHeaders(echoOrigin)),
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'X-Accel-Buffering': 'no',
              },
            });
          }
        } catch {
          /* fall through */
        }
      }
    }

    /* ===== Episodic write-back (optional, best-effort) ===== */
    if (memoryEnabled) {
      try {
        await maybeStoreEpisode(userKey, workspaceId, rolled);
      } catch (err) {
        console.error('[chat] maybeStoreEpisode failed (non-fatal)', err);
      }
    }

    /* ===== Build message list (include attachments) ===== */
    const rolledWithAttachments = attachmentSection
      ? [...rolled, { role: 'user', content: attachmentSection }]
      : rolled;

    /* ===== Non-stream ===== */
    const useSolace = Boolean(SOLACE_URL && SOLACE_KEY);
    if (!wantStream) {
      if (useSolace) {
        try {
          const text = await withTimeout(
            solaceNonStream({
              mode: route.mode,
              userId,
              userName,
              system,
              messages: rolledWithAttachments,
              temperature: 0.2,
            }),
            REQUEST_TIMEOUT_MS
          );
          return NextResponse.json(
            {
              text,
              model: 'solace',
              identity: SOLACE_NAME,
              mode: route.mode,
              confidence: route.confidence,
              filters: effectiveFilters,
            },
            { headers: corsHeaders(echoOrigin) }
          );
        } catch {
          /* fallback to OpenAI */
        }
      }

      const openai: OpenAI = await getOpenAI();
      const resp = await withTimeout(
        openai.responses.create({
          model: MODEL,
          input:
            system +
            '\n\n' +
            rolledWithAttachments.map((m) => `${m.role}: ${m.content}`).join('\n'),
          max_output_tokens: 800,
          temperature: 0.2,
        }),
        REQUEST_TIMEOUT_MS
      );

      const text = (resp as any).output_text?.trim() || '[No reply from model]';
      return NextResponse.json(
        {
          text,
          model: MODEL,
          identity: SOLACE_NAME,
          mode: route.mode,
          confidence: route.confidence,
          filters: effectiveFilters,
        },
        { headers: corsHeaders(echoOrigin) }
      );
    }

    /* ===== Stream ===== */
    if (useSolace) {
      try {
        const stream = await solaceStream({
          mode: route.mode,
          userId,
          userName,
          system,
          messages: rolledWithAttachments,
          temperature: 0.2,
        });
        return new NextResponse(stream as any, {
          headers: {
            ...headersToRecord(corsHeaders(echoOrigin)),
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'X-Accel-Buffering': 'no',
          },
        });
      } catch {
        /* fallback to OpenAI */
      }
    }

    // OpenAI SSE fallback
    const apiKey = process.env.OPENAI_API_KEY || '';
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          ...rolledWithAttachments.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        ],
      }),
    });

    if (!r.ok || !r.body) {
      const t = await r.text().catch(() => '');
      return new NextResponse(`Model error: ${r.status} ${t}`, {
        status: 500,
        headers: corsHeaders(echoOrigin),
      });
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


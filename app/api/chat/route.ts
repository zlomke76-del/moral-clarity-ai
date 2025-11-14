// app/api/chat/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

import { getOpenAI } from '@/lib/openai';
import { webSearch } from '@/lib/search';
import { routeMode } from '@/core/mode-router';

/* ========= MEMORY ========= */
import { searchMemories, remember } from '@/lib/memory';

/* ========= MCA CONFIG (defaults for user/workspace) ========= */
import { MCA_WORKSPACE_ID, MCA_USER_KEY } from '@/lib/mca-config';

/* ========= MODEL / TIMEOUT ========= */
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const VISION_MODEL = process.env.OPENAI_VISION_MODEL || MODEL;
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
  } catch {}
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
// eslint-disable-next-line max-len
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

  const parts: string[] = [];
  parts.push(
    `IDENTITY\nYou are ${SOLACE_NAME} — a steady, principled presence. Listen first, then offer concise counsel with moral clarity.`,
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

/* ========= Attachments ========= */
type Attachment = { name: string; url: string; type?: string };

function clampText(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n) + '\n[...truncated...]';
}

/**
 * Use OpenAI vision to describe / OCR an image.
 * We keep the prompt structured so the output is useful in a text-only context.
 */
async function describeImageWithOpenAI(att: Attachment): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY || '';
  if (!apiKey) {
    return `[Image file: ${att.name} (${att.type || 'image'}) — vision disabled (no API key).]`;
  }

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'You are helping with document understanding. ' +
                  'Describe this image in structured text: if it is a diagram, explain the components and relationships; ' +
                  'if there is visible text, transcribe the key labels; if it is a photo, describe the main elements. ' +
                  'Keep it concise but information-dense.',
              },
              {
                type: 'image_url',
                image_url: { url: att.url },
              },
            ],
          },
        ],
      }),
    });

    if (!r.ok) {
      const t = await r.text().catch(() => '');
      return `[Image file: ${att.name} (${att.type || 'image'}) — vision error: ${r.status} ${t}]`;
    }

    const j = await r.json().catch(() => ({} as any));
    const text =
      j?.choices?.[0]?.message?.content
        ?.map((c: any) => (typeof c?.text === 'string' ? c.text : ''))
        .join(' ')
        .trim() ||
      j?.choices?.[0]?.message?.content ||
      '';

    if (!text) {
      return `[Image file: ${att.name} (${att.type || 'image'}) — vision produced no description.]`;
    }

    return text;
  } catch (e: any) {
    return `[Image file: ${att.name} (${att.type || 'image'}) — vision exception: ${e?.message || e}]`;
  }
}

async function fetchAttachmentAsText(att: Attachment): Promise<string> {
  const res = await fetch(att.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = (res.headers.get('content-type') || att.type || '').toLowerCase();

  // ---- PDF ---------------------------------------------------------
  if (ct.includes('pdf') || /\.pdf(?:$|\?)/i.test(att.url)) {
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await pdfParse(buf);
    return out.text || '';
  }

  // ---- DOCX (Word) -------------------------------------------------
  if (
    ct.includes(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) || /\.docx(?:$|\?)/i.test(att.name)
  ) {
    const buf = Buffer.from(await res.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer: buf });
    return result.value || '';
  }

  // ---- XLSX (Excel) ------------------------------------------------
  if (
    ct.includes(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) || /\.xlsx(?:$|\?)/i.test(att.name)
  ) {
    const buf = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buf, { type: 'buffer' });

    const lines: string[] = [];
    for (const sheetName of wb.SheetNames.slice(0, 3)) {
      const sheet = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      lines.push(`Sheet: ${sheetName}`);
      for (const row of rows.slice(0, 20)) {
        lines.push((row || []).map((v) => String(v ?? '')).join('\t'));
      }
      lines.push('');
    }
    return lines.join('\n');
  }

  // ---- Text-like (txt, md, csv, json, etc.) ------------------------
  if (
    ct.includes('text/') ||
    ct.includes('json') ||
    ct.includes('csv') ||
    /\.(?:txt|md|csv|json)$/i.test(att.name)
  ) {
    return await res.text();
  }

  // ---- Images (PNG, JPG, etc.) via Vision --------------------------
  if (ct.startsWith('image/') || /\.(?:png|jpe?g|gif|webp|bmp|tiff?)$/i.test(att.name)) {
    const description = await describeImageWithOpenAI(att);
    return description;
  }

  // ---- Fallback ----------------------------------------------------
  return `[Unsupported file type: ${att.name} (${ct || 'unknown'})]`;
}

/* ========= Memory helpers ========= */
function getUserKeyFromReq(req: NextRequest, body: any) {
  // default to configured MCA_USER_KEY instead of hard-coded "guest"
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

    /* ===== MEMORY: recall pack (scoped) ===== */
    let userKey = getUserKeyFromReq(req, body);
    if (!userKey || userKey === 'guest') {
      // last-resort server-side key if client didn't provide one
      userKey = `u_${crypto.randomUUID()}`;
    }
    const workspaceId: string = body?.workspace_id || MCA_WORKSPACE_ID;

    const memoryEnabled = Boolean(
      process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // We keep hits accessible for the echo path
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

        // fold recent explicit "remember ..." clauses into query
        const explicitInTurns = rolled
          .filter((m) => m.role === 'user')
          .map((m) => m.content.match(/\bremember(?:\s+that)?\s+(.+)/i)?.[1])
          .filter(Boolean)
          .join(' ; ');

        const baseQuery = lastUser || fallbackQuery;
        const query = [baseQuery, explicitInTurns].filter(Boolean).join(' | ');

        // (user_key, query, k)
        hits = await searchMemories(userKey, query, 8);

        const pack = (hits ?? [])
          .map((m: any) => `• (${m.purpose ?? 'fact'}) ${m.content}`)
          .slice(0, 12)
          .join('\n');

        memorySection =
          `\n\nMEMORY PACK (private, user-scoped)\nUse these stable facts/preferences **only if relevant**:\n` +
          (pack || '• (none)');
      } catch {
        memorySection = '';
      }
    }

    /* ===== Memory Echo: "what do you remember" fast path ===== */
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

    /* ===== WEB SEARCH (fresh context) ===== */
    let webSection = '';
    let hasWebContext = false;
    try {
      const wantsFresh =
        /\b(latest|today|this week|news|recent|update|updates|look up|search|what happened|breaking|breaking news|headlines|top stories)\b/i.test(
          lastUser
        );
      const webFlag =
        process.env.NEXT_PUBLIC_OPENAI_WEB_ENABLED_flag ??
        process.env.OPENAI_WEB_ENABLED_flag ??
        null;
      if (wantsFresh && webFlag) {
        const results = await webSearch(lastUser, { news: true, max: 5 });
        if (Array.isArray(results) && results.length) {
          const lines = results
            .map((r: any, i: number) => `• [${i + 1}] ${r.title} — ${r.url}`)
            .join('\n');
          webSection =
            `\n\nWEB CONTEXT (recent search)\n${lines}\n\nGuidance:\n` +
            '- Use these results to answer directly.\n' +
            '- Prefer the most recent and reputable sources.\n' +
            '- If uncertain, say what is unknown.\n' +
            '- When referencing items, use bracket numbers like [1], [2].';
          hasWebContext = true;
        }
      }
    } catch (err) {
      console.error('webSearch failed:', err);
    }

    /* ===== Attachments digest ===== */
    let attachmentSection = '';
    try {
      const atts = (Array.isArray(body?.attachments) ? body.attachments : []) as Attachment[];
      if (atts.length) {
        const MAX_PER_FILE = 200_000;
        const MAX_TOTAL = 350_000;
        const parts: string[] = [];
        let total = 0;

        for (const att of atts) {
          try {
            const raw = await fetchAttachmentAsText(att);
            const clipped = clampText(raw, MAX_PER_FILE);
            const block =
              `\n--- Attachment: ${att.name}\n(source: ${att.url})\n` +
              '```text\n' +
              clipped +
              '\n```\n';
            if (total + block.length > MAX_TOTAL) {
              parts.push(`\n--- [Skipping remaining attachments: token cap reached]`);
              break;
            }
            parts.push(block);
            total += block.length;
          } catch (e: any) {
            parts.push(
              `\n--- Attachment: ${att.name}\n[Error reading file: ${e?.message || e}]`
            );
          }
        }

        attachmentSection =
          `\n\nATTACHMENT DIGEST\nThe user provided ${atts.length} attachment(s). Use the content below in your analysis.\n` +
          parts.join('');
      }
    } catch {
      attachmentSection = '';
    }

    // If web context exists, add a strong “no-disclaimer” instruction
    const webAssertion = hasWebContext
      ? `\n\nREAL-TIME CONTEXT\n- You DO have recent web results above. Do NOT say you cannot provide real-time updates.\n- Synthesize a brief answer using those results, and include bracketed refs like [1], [3].`
      : '';

    const system = baseSystem + memorySection + webSection + webAssertion;

    /* ===== Explicit "remember ..." capture (scoped) ===== */
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
          // fall through
        }
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
          // fallback to OpenAI
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
        // fallback to OpenAI
      }
    }

    // OpenAI SSE fallback
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

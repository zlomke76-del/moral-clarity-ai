// app/api/chat/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { webSearch } from "@/lib/search";
import { NextRequest, NextResponse } from 'next/server';
import type OpenAI from 'openai';
import { getOpenAI } from '@/lib/openai';
import { routeMode } from '@/core/mode-router';

/* ========= MEMORY (uses /lib/memory.ts) ========= */
import { searchMemories, remember } from '@/lib/memory';
/* =============================================== */

/* ========= (NEW) ATTACHMENT INGEST ========= */
import pdfParse from 'pdf-parse'; // <<< NEW

type Attachment = { name: string; url: string; type?: string }; // <<< NEW

async function fetchAttachmentAsText(att: Attachment): Promise<string> { // <<< NEW
  const res = await fetch(att.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = (res.headers.get('content-type') || att.type || '').toLowerCase();
  // PDF
  if (ct.includes('pdf') || /\.pdf(?:$|\?)/i.test(att.url)) {
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await pdfParse(buf);
    return out.text || '';
  }
  // Text-ish
  if (
    ct.includes('text/') ||
    ct.includes('json') ||
    ct.includes('csv') ||
    /\.(?:txt|md|csv|json)$/i.test(att.name)
  ) {
    return await res.text();
  }
  // Fallback stub
  return `[Unsupported file type: ${att.name} (${ct || 'unknown'})]`;
}

function clampText(s: string, n: number) { // <<< NEW
  if (s.length <= n) return s;
  return s.slice(0, n) + '\n[...truncated...]';
}
/* =========================================== */

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
  if (!origin) return null; // same-origin
  try {
    if (ALLOWED_SET.has(origin)) return origin;
    const url = new URL(origin);
    if (hostIsAllowedWildcard(url.hostname)) return origin;
  } catch {
    /* ignore */
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

/* ========= SOLACE (IDENTITY / BACKEND) ========= */
const SOLACE_NAME = 'Solace';
const SOLACE_URL = process.env.SOLACE_API_URL || '';
const SOLACE_KEY = process.env.SOLACE_API_KEY || '';

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

/* ========= SCRIPTURE POLICY (DYNAMIC) ========= */
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

function isFirstRealTurn(messages: Array<{ role: string; content: string }>) {
  const userCount = messages.filter((m) => m.role?.toLowerCase() === 'user').length;
  const assistantCount = messages.filter((m) => m.role?.toLowerCase() === 'assistant').length;
  return userCount <= 1 || messages.length < 3 || assistantCount === 0;
}

function hasEmotionalOrMoralCue(text: string) {
  const t = (text || '').toLowerCase();
  const emo = [
    'hope','lost','afraid','fear','anxious','anxiety','grief','sad','sorrow','depressed','stress','overwhelmed','lonely','alone','comfort','forgive','forgiveness','guilt','shame','purpose','meaning',
  ];
  const moral = [
    'right','wrong','unfair','injustice','justice','truth','honest','dishonest','integrity','mercy','compassion','courage',
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

  return { prompt: parts.join('\n\n'), wantsAbrahamic, forceFirstTurnSeeding };
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('Request timed out')), ms);
    p.then((v) => { clearTimeout(id); resolve(v); })
     .catch((e) => { clearTimeout(id); reject(e); });
  });
}

/* ========= MEMORY HELPERS ========= */
function getUserKeyFromReq(req: NextRequest, body: any) {
  return req.headers.get('x-user-key') || body?.user_key || 'guest';
}

/** Accept: "remember X", "remember that X", "please remember X", "store this: X" */
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
/* ================================== */

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

/* ========= OPTIONS (preflight) ========= */
export async function OPTIONS(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/* ========= SOLACE HELPERS ========= */
async function solaceNonStream(payload: any) {
  const r = await fetch(SOLACE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SOLACE_KEY}` },
    body: JSON.stringify({ ...payload, stream: false }),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    throw new Error(`Solace ${r.status}: ${t}`);
  }
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
  if (!r.ok || !r.body) {
    const t = await r.text().catch(() => '');
    throw new Error(`Solace ${r.status}: ${t}`);
  }
  return r.body as ReadableStream<Uint8Array>;
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
    const lastModeHeader = req.headers.get('x-last-mode');
    const route = routeMode(lastUser, { lastMode: lastModeHeader as any });

    // ---------- Additive filters ----------
    const incoming = new Set(rawFilters);

    // 1) Auto-add Guidance if router hints it.
    if (route.mode === 'Guidance') incoming.add('guidance');

    // 2) **Default Ministry ON** unless user explicitly asked for secular framing.
    //    (This satisfies “start in ministry mode by default”.)
    if (!userAskedForSecular) {
      incoming.add('ministry');
      incoming.add('abrahamic');
    }

    // Allow explicit body.ministry===false to force it off (escape hatch).
    if (body?.ministry === false) {
      incoming.delete('ministry');
      incoming.delete('abrahamic');
    }

    const effectiveFilters = Array.from(incoming);
    // -------------------------------------

    const { prompt: baseSystem } = buildSystemPrompt(
      effectiveFilters,
      userAskedForSecular,
      rolled
    );

    /* ========= MEMORY: recall pack ========= */
    const userKey = getUserKeyFromReq(req, body);
    const memoryEnabled = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    let memorySection = '';
    if (memoryEnabled) {
      try {
        const fallbackQuery =
          rolled.filter((m) => m.role === 'user').map((m) => m.content).slice(-3).join('\n') || 'general';
        const query = lastUser || fallbackQuery;

        const hits = await searchMemories(userKey, query, 8);
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
    /* ====================================== */

    /* ========= WEB SEARCH (fresh info auto-context) ========= */
    let webSection = '';
    try {
      const wantsFresh = /\b(latest|today|this week|news|recent|update|updates|look up|search|what happened|breaking)\b/i
        .test(lastUser);
      if (wantsFresh) {
        const results = await webSearch(lastUser, { news: true, max: 5 });
        if (Array.isArray(results) && results.length) {
          const lines = results
            .map((r: any, i: number) => `• [${i + 1}] ${r.title} — ${r.url}`)
            .join('\n');
          webSection = `\n\nWEB CONTEXT (recent search)\n${lines}`;
        }
      }
    } catch (err) {
      // Non-fatal; just log and continue
      console.error('webSearch failed:', err);
    }
    /* ======================================================== */

    /* ========= (NEW) ATTACHMENTS DIGEST ========= */
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
              `\n--- Attachment: ${att.name}\n` +
              `(source: ${att.url})\n` +
              '```\n' + clipped + '\n```\n';
            if (total + block.length > MAX_TOTAL) {
              parts.push(`\n--- [Skipping remaining attachments: token cap reached]`);
              break;
            }
            parts.push(block);
            total += block.length;
          } catch (e: any) {
            parts.push(`\n--- Attachment: ${att.name}\n[Error reading file: ${e?.message || e}]`);
          }
        }

        attachmentSection =
          `\n\nATTACHMENT DIGEST\nThe user provided ${atts.length} attachment(s). Use the content below in your analysis.\n` +
          parts.join('');
      }
    } catch {
      attachmentSection = '';
    }
    /* ======================================================== */

    const system = baseSystem + memorySection + webSection;

    /* ========= MEMORY: capture explicit "remember ..." ========= */
    if (memoryEnabled) {
      const explicit = detectExplicitRemember(lastUser);
      if (explicit) {
        try {
          await remember({ user_key: userKey, content: explicit, purpose: 'fact', title: '' });
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
          // non-fatal: fall through to normal answering
        }
      }
    }
    /* =========================================================== */

    // Prefer SOLACE if configured
    const useSolace = Boolean(SOLACE_URL && SOLACE_KEY);

    // (NEW) roll in attachments as an extra user message so both backends see it
    const rolledWithAttachments =
      attachmentSection
        ? [...rolled, { role: 'user', content: attachmentSection }]
        : rolled;

    if (!wantStream) {
      if (useSolace) {
        try {
          const text = await withTimeout(
            solaceNonStream({
              mode: route.mode,
              userId,
              userName,
              system,
              messages: rolledWithAttachments, // <<< NEW
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
          // fall through to OpenAI
        }
      }

      const openai: OpenAI = await getOpenAI();
      const resp = await withTimeout(
        openai.responses.create({
          model: MODEL,
          input: system + '\n\n' + rolledWithAttachments.map((m) => `${m.role}: ${m.content}`).join('\n'), // <<< NEW
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

    // ----- Stream path -----
    if (useSolace) {
      try {
        const stream = await solaceStream({
          mode: route.mode,
          userId,
          userName,
          system,
          messages: rolledWithAttachments, // <<< NEW
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
        // fall through to OpenAI streaming
      }
    }

    // OpenAI SSE streaming fallback
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
          ...rolledWithAttachments.map((m) => ({ // <<< NEW
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

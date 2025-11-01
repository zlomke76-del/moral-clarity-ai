// app/api/chat/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type OpenAI from 'openai';

import { webSearch } from '@/lib/search';
import { getOpenAI } from '@/lib/openai';
import { routeMode } from '@/core/mode-router';

/* ========= MEMORY (recall API still available) ========= */
import { searchMemories /* , remember (not used for writes here) */ } from '@/lib/memory';
/* ====================================================== */

/* ========= ATTACHMENT TYPES ========= */
type Attachment = { name: string; url: string; type?: string };

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
  • Torah/Tanakh,
  • New Testament,
  • Qur'an (with Sunnah as general guidance).
- Emphasize dignity, stewardship, mercy, justice, truthfulness, responsibility before God.
- Avoid sectarian polemics or proselytizing; inclusive language.
- Recommend local clergy/scholars for detailed rulings when appropriate.`;

const GUIDELINE_GUIDANCE = `GUIDANCE ADD-ON
- Briefly red-team the plan if stakes are high.
- Offer a compact risk register (top 3–5) and simple options matrix when asked.
- End with a short actionable checklist when the user explicitly requests steps.`;

const RESPONSE_FORMAT = `RESPONSE FORMAT (DEFAULT)
- Default to a single "Brief Answer" (2–5 sentences, plain language).
- Include "Rationale" and/or "Next Steps" ONLY IF the user explicitly asks for them.
- Keep paragraphs short; avoid verbosity.`;

/* ========= SCRIPTURE POLICY (DYNAMIC) ========= */
function scripturePolicyText(opts: {
  wantsAbrahamic: boolean;
  forceFirstTurnSeeding: boolean;
  userAskedForSecular: boolean;
}) {
  const base =
    `SCRIPTURE POLICY\n` +
    `- Very short references only (e.g., "Exodus 20", "Matthew 5", "Qur'an 4:135"); no long quotes by default.\n` +
    `- Weave 1–2 references inline only when relevant.\n`;
  if (!opts.wantsAbrahamic || opts.userAskedForSecular) {
    return base + `- Abrahamic references DISABLED due to secular framing or inactive Abrahamic layer.`;
  }
  if (opts.forceFirstTurnSeeding) {
    return (
      base +
      `- FIRST TURN: Offer ONE gentle reference (max 1–2) to anchor hope/justice/mercy.\n` +
      `- Later turns: include only when clearly helpful or requested.`
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
  return /\bsecular framing\b|\bsecular only\b|\bno scripture\b|\bno religious\b|\bkeep it secular\b|\bstrictly secular\b/.test(text);
}
function isFirstRealTurn(messages: Array<{ role: string; content: string }>) {
  const userCount = messages.filter((m) => m.role?.toLowerCase() === 'user').length;
  const assistantCount = messages.filter((m) => m.role?.toLowerCase() === 'assistant').length;
  return userCount <= 1 || messages.length < 3 || assistantCount === 0;
}
function hasEmotionalOrMoralCue(text: string) {
  const t = (text || '').toLowerCase();
  const emo = ['hope','lost','afraid','fear','anxious','anxiety','grief','sad','sorrow','depressed','stress','overwhelmed','lonely','alone','comfort','forgive','forgiveness','guilt','shame','purpose','meaning'];
  const moral = ['right','wrong','unfair','injustice','justice','truth','honest','dishonest','integrity','mercy','compassion','courage'];
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

  const firstUserText = [...messages].reverse().find((m) => m.role?.toLowerCase() === 'user')?.content ?? '';
  const firstTurn = isFirstRealTurn(messages);
  const moralOrEmo = hasEmotionalOrMoralCue(firstUserText);
  const forceFirstTurnSeeding = wantsAbrahamic && !userWantsSecular && firstTurn && moralOrEmo;

  const parts: string[] = [];
  parts.push(
    `IDENTITY\nYou are ${SOLACE_NAME} — a steady, principled presence. You listen first, then offer concise counsel with moral clarity.`,
    HOUSE_RULES,
    GUIDELINE_NEUTRAL,
    RESPONSE_FORMAT,
    scripturePolicyText({ wantsAbrahamic, forceFirstTurnSeeding, userAskedForSecular: userWantsSecular })
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

/* ========= HEALTHCHECK ========= */
export async function GET(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
  const backend = SOLACE_URL && SOLACE_KEY ? 'solace' : 'openai';
  const memoryEnabled = Boolean(process.env.SUPABASE_URL); // presence check only
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

/* ========= ATTACHMENT DIGEST ========= */

let _pdfParseFn: ((buf: Buffer) => Promise<{ text?: string }>) | null = null;
async function pdfText(buf: Buffer): Promise<string> {
  if (!_pdfParseFn) {
    const mod: any = await import('pdf-parse');
    _pdfParseFn = (mod?.default ?? mod) as any;
  }
  const out = await _pdfParseFn!(buf);
  return (out?.text ?? '').toString();
}

// OCR via env-gated dynamic import
async function imageOcrText(buf: Buffer): Promise<string> {
  if (process.env.MCAI_ENABLE_OCR !== '1') return '[Image attached: OCR not enabled]';
  try {
    // eslint-disable-next-line no-new-func
    const dynImport = new Function('m', 'return import(m)');
    const { createWorker } = (await dynImport('tesseract.js')) as any;
    const worker = await createWorker();
    try {
      const { data } = await worker.recognize(buf);
      await worker.terminate();
      const s = (data?.text || '').trim();
      return s || '[Image text: (no text detected)]';
    } catch {
      try { await worker.terminate(); } catch {}
      return '[Image attached: OCR failed]';
    }
  } catch {
    return '[Image attached: OCR library unavailable]';
  }
}

function clampText(s: string, n: number) { return s.length <= n ? s : s.slice(0, n) + '\n[...truncated...]'; }

// **Hardened** attachment parser: content-type + extension + octet-stream sniff + explicit .xlsx message
async function fetchAttachmentAsText(att: Attachment): Promise<string> {
  if (!att?.url) throw new Error('no url');

  const res = await fetch(att.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const ct = (res.headers.get('content-type') || att.type || '').toLowerCase();
  const url = att.url || '';
  const name = (att.name || '').toLowerCase();
  const urlHas = (re: RegExp) => re.test(url);
  const nameHas = (re: RegExp) => re.test(name);

  // ----- PDF -----
  if (ct.includes('pdf') || urlHas(/\.pdf(?:$|\?)/i) || nameHas(/\.pdf$/i)) {
    const buf = Buffer.from(await res.arrayBuffer());
    return pdfText(buf);
  }

  // ----- Images → OCR -----
  const isImage =
    ct.startsWith('image/') ||
    urlHas(/\.(?:png|jpe?g|bmp|gif|webp)(?:$|\?)/i) ||
    nameHas(/\.(?:png|jpe?g|bmp|gif|webp)$/i);
  if (isImage) {
    const buf = Buffer.from(await res.arrayBuffer());
    return imageOcrText(buf);
  }

  // ----- Text-like (by CT or extension) -----
  const isTextLikeCT = ct.startsWith('text/') || ct.includes('json') || ct.includes('csv');
  const isTextLikeExt = urlHas(/\.(?:txt|md|csv|json)(?:$|\?)/i) || nameHas(/\.(?:txt|md|csv|json)$/i);
  if (isTextLikeCT || isTextLikeExt) {
    return await res.text();
  }

  // ----- Excel explicitly unsupported for now -----
  const isXlsx =
    ct.includes('spreadsheetml') || urlHas(/\.xlsx(?:$|\?)/i) || nameHas(/\.xlsx$/i);
  if (isXlsx) {
    return '[Unsupported: Excel .xlsx not supported. Please upload CSV or TXT.]';
  }

  // ----- Small octet-stream sniff (try decode if small and looks textual) -----
  if (ct === 'application/octet-stream') {
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length <= 2_000_000) {
      const asText = new TextDecoder().decode(buf);
      if (/[\x09\x0A\x0D\x20-\x7E]/.test(asText)) return asText;
    }
  }

  return `[Unsupported file type: ${att.name || 'file'} (${ct || 'unknown'})]`;
}

/* ========= DB helpers (isolation-critical) ========= */

async function getAuthedUserAndWorkspace(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, workspaceId: null as string | null };

  // Resolve primary workspace via membership; fail closed if none
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_uid', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  return { supabase, user, workspaceId: membership?.workspace_id ?? null };
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

    // For downstream payloads only (not used for auth)
    const userIdHeader = body?.userId ?? null;
    const userNameHeader = body?.userName ?? null;

    // —— Log request identity mapping to catch any “Joy as Tim” confusion —— //
    const xUserKey = req.headers.get('x-user-key');
    console.info('[REQ] x-user-key:', xUserKey ? 'present' : 'null', 'body.userId:', userIdHeader ? 'present' : 'null');

    // —— Auth & workspace (critical for isolation) —— //
    const { supabase, user, workspaceId } = await getAuthedUserAndWorkspace(req);
    const memoryEnabled = Boolean(user && workspaceId);

    const rolled = trimConversation(messages);
    const userAskedForSecular = wantsSecular(rolled);
    const lastUser = [...rolled].reverse().find((m) => m.role?.toLowerCase() === 'user')?.content || '';

    const lastModeHeader = req.headers.get('x-last-mode');
    const route = routeMode(lastUser, { lastMode: lastModeHeader as any });

    // ---------- Additive filters ---------- //
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

    /* ========= MEMORY: recall pack ========= */
    let memorySection = '';
    if (memoryEnabled) {
      try {
        const userKey = user!.id; // ensure recall is scoped to the authed user
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

    /* ========= WEB SEARCH (fresh info) ========= */
    let webSection = '';
    try {
      const wantsFresh = /\b(latest|today|this week|news|recent|update|updates|look up|search|what happened|breaking)\b/i
        .test(lastUser);
      if (wantsFresh) {
        const results = await webSearch(lastUser, { news: true, max: 5 });
        if (Array.isArray(results) && results.length) {
          const lines = results.map((r: any, i: number) => `• [${i + 1}] ${r.title} — ${r.url}`).join('\n');
          webSection = `\n\nWEB CONTEXT (recent search)\n${lines}`;
        }
      }
    } catch {}

    /* ========= ATTACHMENTS DIGEST ========= */
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
            console.info('[ATT] fetching', att?.name || '(unnamed)', att?.url?.slice(0, 80) || '');
            const raw = await fetchAttachmentAsText(att);
            const clipped = clampText(raw, MAX_PER_FILE);
            const block = `\n--- Attachment: ${att.name}\n(source: ${att.url})\n\`\`\`\n${clipped}\n\`\`\`\n`;
            if (total + block.length > MAX_TOTAL) {
              parts.push(`\n--- [Skipping remaining attachments: token cap reached]`);
              break;
            }
            parts.push(block);
            total += block.length;
            console.info('[ATT] ok →', att?.name || 'file', 'chars=', clipped.length);
          } catch (e: any) {
            parts.push(`\n--- Attachment: ${att.name}\n[Error reading file: ${e?.message || e}]`);
            console.warn('[ATT] parse failed:', att?.name || 'file', String(e));
          }
        }

        attachmentSection =
          `\n\nATTACHMENT DIGEST\nThe user provided ${atts.length} attachment(s). Use the content below in your analysis.\n` +
          parts.join('');
      }
    } catch {}

    const system = baseSystem + memorySection + webSection;

    /* ========= MEMORY: capture explicit "remember ..." (DB write as USER) ========= */
    if (memoryEnabled) {
      const explicit = detectExplicitRemember(lastUser);
      if (explicit) {
        try {
          // Insert directly with anon+session; RLS enforces isolation.
          const { error: insErr } = await supabase.from('memories').insert({
            user_id: user!.id,
            author_user_id: user!.id,
            workspace_id: workspaceId,         // <- critical link
            content: explicit,
            tokens: 0,
            source: { by: 'user', ingest: 'chat' },
          });
          if (insErr) throw insErr;

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
          // If memory write fails, fall through to answering normally.
        }
      }
    }

    // Prefer SOLACE if configured
    const useSolace = Boolean(SOLACE_URL && SOLACE_KEY);
    const rolledWithAttachments =
      attachmentSection ? [...rolled, { role: 'user', content: attachmentSection }] : rolled;

    if (!wantStream) {
      if (useSolace) {
        try {
          const text = await withTimeout(
            solaceNonStream({
              mode: route.mode,
              userId: userIdHeader,
              userName: userNameHeader,
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
          // fall through to OpenAI
        }
      }

      const openai: OpenAI = await getOpenAI();
      const resp = await withTimeout(
        openai.responses.create({
          model: MODEL,
          input: system + '\n\n' + rolledWithAttachments.map((m) => `${m.role}: ${m.content}`).join('\n'),
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

    // ----- Stream path ----- //
    if (useSolace) {
      try {
        const stream = await solaceStream({
          mode: route.mode,
          userId: userIdHeader,
          userName: userNameHeader,
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
        // fall through to OpenAI streaming
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
      { status: err?.message === 'Request timed out' ? 504 : 500, headers: corsHeaders(echoOrigin) }
    );
  }
}


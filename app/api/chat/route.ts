// app/api/chat/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'iad1';
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server';
import type OpenAI from 'openai';

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

/* ========= SOLACE PERSONA / CHAT SYSTEM ========= */
import {
  normalizeFilters,
  trimConversation,
  wantsSecular,
  wantsImageGeneration,
  extractFirstUrl,
  wantsDeepResearch,
  looksLikeGenericNewsQuestion,
  buildChatPersonaPrompt,
} from '@/lib/solace/chat-system';

/* ========= NEUTRAL NEWS DIGEST ========= */
import {
  getSolaceNewsDigest,
  type SolaceDigestStory,
} from '@/lib/news/solace-digest';

/* ========= MODEL / TIMEOUT (BASELINE) ========= */
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const BASE_REQUEST_TIMEOUT_MS = 20_000;

/* ========= FOUNDER MODE (userKey/email based) ========= */
/**
 * Founder-only lane is keyed off userKey/email.
 *
 * Configure in env:
 * - FOUNDER_USER_EMAIL  = your-email@example.com
 * - FOUNDER_USER_KEYS   = optional, comma-separated list of additional keys
 *
 * Any request whose effective userKey matches one of these
 * gets higher token limits + longer timeout + larger memory pack.
 */
const FOUNDER_USER_EMAIL = (process.env.FOUNDER_USER_EMAIL || '').toLowerCase();
const FOUNDER_USER_KEYS = (process.env.FOUNDER_USER_KEYS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const FOUNDER_MAX_OUTPUT_TOKENS = 12000; // was 3000
const NORMAL_MAX_OUTPUT_TOKENS = 1200; // was 800 (optional bump)

const FOUNDER_REQUEST_TIMEOUT_MS = 180_000; // 120s instead of 60s
const NORMAL_REQUEST_TIMEOUT_MS = BASE_REQUEST_TIMEOUT_MS; // 20s is fine for others

const FOUNDER_MEMORY_FACTS_LIMIT = 16;
const FOUNDER_MEMORY_EPISODES_LIMIT = 12;
const NORMAL_MEMORY_FACTS_LIMIT = 8;
const NORMAL_MEMORY_EPISODES_LIMIT = 6;

function isFounderUserKey(userKey: string | null | undefined): boolean {
  if (!userKey) return false;
  const key = String(userKey).toLowerCase().trim();
  if (!key) return false;

  // Hard-wire Tim as founder
  if (key === 'zlomke76@gmail.com') return true;

  if (FOUNDER_USER_EMAIL && key === FOUNDER_USER_EMAIL) return true;
  if (FOUNDER_USER_KEYS.length && FOUNDER_USER_KEYS.includes(key)) return true;

  return false;
}

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

/* ========= SOLACE BACKEND ========= */
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
    return String((j as any).text ?? (j as any).output ?? (j as any).data ?? '');
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

/* ========= Small helpers ========= */

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

/* ========= SUPABASE PRESENCE FOR MEMORY ONLY ========= */

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SUPABASE_SERVICE_ROLE_KEY = process.env
  .SUPABASE_SERVICE_ROLE_KEY as string | undefined;

/* ========= HEALTHCHECK ========= */
export async function GET(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
  const backend = SOLACE_URL && SOLACE_KEY ? 'solace' : 'openai';
  const memoryEnabled = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
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

    /* ===== USER KEY & FOUNDER FLAG ===== */
    let userKey = getUserKeyFromReq(req, body);
    if (!userKey || userKey === 'guest') {
      userKey = `u_${crypto.randomUUID()}`;
    }
    const isFounder = isFounderUserKey(userKey);

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

    const workspaceId: string = body?.workspace_id || MCA_WORKSPACE_ID;

    const memoryEnabled = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

    let memorySection = '';

    /* ===== MEMORY: recall pack (scoped, episodic + factual) ===== */
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

        const factsLimit = isFounder ? FOUNDER_MEMORY_FACTS_LIMIT : NORMAL_MEMORY_FACTS_LIMIT;
        const episodesLimit = isFounder
          ? FOUNDER_MEMORY_EPISODES_LIMIT
          : NORMAL_MEMORY_EPISODES_LIMIT;

        // Episodic + factual memory pack for Solace system prompt
        const pack = await getMemoryPack(userKey, query, {
          factsLimit,
          episodesLimit,
        });

        memorySection =
          `\n\nMEMORY PACK (private, user-scoped)\n` +
          `These are authoritative facts, preferences, and key conversation episodes for THIS user.\n` +
          `- Treat them as a coherent profile and history, not isolated trivia.\n` +
          `- When answering, explicitly connect your guidance to these items when relevant\n` +
          `  (e.g., "You told me X before, so I’ll build on that here").\n` +
          `- If multiple memories relate to the same project, person, or concern, tie them together\n` +
          `  and reason across them instead of handling each in isolation.\n` +
          `- When the user seems stuck, zoom out and reflect patterns you see across these memories.\n` +
          (pack || '• (none)');
      } catch (err) {
        console.error('[chat] memory recall failed', err);
        memorySection = '';
      }
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

    let newsSection = '';
    let hasNewsContext = false;
    let newsStoriesForLedger: SolaceDigestStory[] | null = null;

    try {
      const wantsDeep = wantsDeepResearch(lastUser);
      const urlInUser = extractFirstUrl(lastUser);

      // Deep research (website / multi-search)
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
          ? `\n\nWEBSITE TEXT SNAPSHOT (truncated)\n"""${pack.urlTextSnippet}""""`
          : '';

        const clarificationHint =
          urlInUser && !wantsDeep
            ? `\n\nNOTE FOR ASSISTANT\n- The user shared a URL (${urlInUser}) but did not clearly state what aspect they want evaluated (design/UX, messaging/clarity, SEO/traffic, trustworthiness, etc.). Before giving a long evaluation, briefly ask which of these they care about most, then tailor your analysis.`
            : '';

        researchSection =
          `\n\nRESEARCH CONTEXT\n- This section aggregates deeper web research (multiple searches and, when applicable, a direct fetch of the target website).\n\nSOURCES\n${bulletsText}${websiteSnippet}${clarificationHint}\n\nGuidance:\n- Use this RESEARCH CONTEXT for deeper analysis, comparisons, and website evaluations.\n- When you reference specific sources from this section, use [R1], [R2], etc., matching the labels in the bullet list.\n- Do NOT claim you lack internet access when this section is present.`;

        hasResearchContext = true;
      }

      // Neutral News Digest
      if (wantsGenericNews || wantsFresh) {
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
            `- Use ONLY this NEWS CONTEXT when answering generic questions like "what is the news today", "news today", or "what's going on in the world?".\n` +
            `- When the user asks for "news" (and does NOT specifically ask for "headlines"), you MUST:\n` +
            `   • Select the 3 most relevant digest items.\n` +
            `   • Expand each into a 300–400 word narrative story.\n` +
            `   • Use ONLY the facts and sequence from that digest item's neutral summary.\n` +
            `   • Maintain a neutral, bias-removed tone while still being engaging and readable.\n` +
            `   • Begin each story with: "[D#] <title> — <outlet> — <url>".\n` +
            `- If the user explicitly asks for "headlines", return 3–6 short headline-style entries with links instead of full stories.\n` +
            `- Do NOT invent additional headlines or stories beyond what appears here.\n` +
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
      }
    } catch (err) {
      console.error('runDeepResearch / Neutral News block failed:', err);
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

    /* ===== Persona system: Solace core via persona.ts ===== */
    const { systemBase } = buildChatPersonaPrompt({
      filters: effectiveFilters,
      messages: rolled,
      userWantsSecular: userAskedForSecular,
      routeMode: route.mode,
    });

    /* ===== REAL-TIME CONTEXT ASSERTION ===== */
    const webAssertion =
      hasResearchContext || hasNewsContext
        ? `\n\nREAL-TIME CONTEXT\n- You DO have recent or web-derived context above (NEWS CONTEXT and/or RESEARCH CONTEXT). Do NOT say you cannot provide real-time updates or that you lack internet access.\n- Synthesize a brief, accurate answer using that context, and include bracketed refs like [D1], [D2] or [R1], [R2] when you rely on specific items.`
        : '';

    const CONTEXT_SEAL = `

CONTEXT OVERRIDE SEAL
- When RESEARCH CONTEXT and/or NEWS CONTEXT appears above, you MUST treat it as your factual view of the outside world for this conversation.
- You are FORBIDDEN from replying with phrases like "I can't browse the internet", "I don't have access to live websites", or similar, whenever these sections are present.
- You MUST base your answer on those contexts for questions about websites, news, or other external events, even if live browsing would normally be required.
- If the context is insufficient to answer precisely, say what is missing, but still use what you have rather than falling back to generic capability disclaimers.

[[SOLACE_DO_NOT_OVERRIDE_THIS_RULE_BLOCK]]`;

    const system =
      systemBase + memorySection + newsSection + researchSection + webAssertion + CONTEXT_SEAL;

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

    /* ===== Dynamic caps: founder vs normal ===== */
    const maxOutputTokens = isFounder
      ? FOUNDER_MAX_OUTPUT_TOKENS
      : NORMAL_MAX_OUTPUT_TOKENS;
    const requestTimeoutMs = isFounder
      ? FOUNDER_REQUEST_TIMEOUT_MS
      : NORMAL_REQUEST_TIMEOUT_MS;

    /* ===== Non-stream ===== */
    const useSolace = Boolean(SOLACE_URL && SOLACE_KEY) && !isFounder;

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
              max_output_tokens: maxOutputTokens,
              context: {
                research: hasResearchContext ? researchSection : null,
                news: hasNewsContext ? newsSection : null,
                memory: memorySection || null,
              },
              context_mode: hasResearchContext || hasNewsContext ? 'authoritative' : 'none',
            }),
            requestTimeoutMs
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
          max_output_tokens: maxOutputTokens,
          temperature: 0.2,
        }),
        requestTimeoutMs
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
          max_output_tokens: maxOutputTokens,
          context: {
            research: hasResearchContext ? researchSection : null,
            news: hasNewsContext ? newsSection : null,
            memory: memorySection || null,
          },
          context_mode: hasResearchContext || hasNewsContext ? 'authoritative' : 'none',
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


// lib/news.ts
// Centralized news helpers for Solace: intent detection, topic routing,
// Tavily-backed fetch, per-item summaries, full-article extraction (server-only),
// bias-removed synthesis, and engaging-but-neutral rewrites.

import type OpenAI from 'openai';
import { webSearch as tavilyWebSearch } from '@/lib/search';
import { getOpenAI } from '@/lib/openai';
import { solaceNonStream, withTimeout } from '@/lib/mcai/solace';
import { MODEL } from '@/lib/mcai/config';

/* ========= Types ========= */
export type Topic = 'general' | 'finance' | 'politics' | 'tech';

export type NewsItem = {
  title: string;
  url: string;
  source?: string;
  published_at?: string;
  snippet?: string;
};

export type NewsStory = {
  title: string;
  url: string;
  source?: string;
  published_at?: string;
  summary: string; // 3–5 sentence neutral summary
};

export type RewrittenArticle = {
  title: string;
  url: string;
  source?: string;
  published_at?: string;
  rewritten: string; // entertaining but impartial rewrite (8–14 sentences)
  references: { label: string; url: string; source?: string; title?: string }[];
};

type TavilyOpts = {
  queries: string | string[];
  limit?: number;
  recencyDays?: number;
  topic?: 'news' | 'general';
};

/* ========= Intent & Topic detection ========= */

// Only fire when the user explicitly asks for fresh headlines/news (avoid looping on follow-ups).
export function looksLikeNewsIntent(text: string): boolean {
  const t = (text || '').toLowerCase().trim();
  return (
    /\b(latest|top|breaking)\s+(news|headlines|stories)\b/.test(t) ||
    /^show me (the )?(latest|top|breaking)?\s*(news|headlines|stories)/.test(t) ||
    /\bwhat('?s| is)\s+(happening|in the news|new today)\b/.test(t)
  );
}

// Follow-up requests should NOT trigger a new digest
export function isFollowUpIntent(text: string): boolean {
  const t = (text || '').toLowerCase();
  return /\b(tell me more|explain|details?|context|walk me through|summari[sz]e|what happened)\b/.test(t);
}

export function detectTopic(text: string): Topic {
  const t = (text || '').toLowerCase();
  if (/\b(finance|market|markets|stock|stocks|equities|earnings|bond|bonds|rates?|fed|nasdaq|dow|s&p|sp500)\b/i.test(t)) return 'finance';
  if (/\b(politic|election|primary|congress|senate|parliament|white\s*house|bill|policy)\b/i.test(t)) return 'politics';
  if (/\b(tech|technology|ai|software|chips?|semiconductor|cyber|startup)\b/i.test(t)) return 'tech';
  return 'general';
}

/* ========= Fetch & Digest ========= */

// Compact digest (bullets + raw sources)
export async function buildNewsDigest(opts: {
  query: string;
  topic?: Topic;
  limit?: number;
  recencyDays?: number;
}) {
  const { query, topic = 'general', limit = 6, recencyDays = topic === 'finance' ? 1 : 2 } = opts;

  const qBase = query?.trim() ? query.trim() : 'top news today';
  const queries = [
    qBase,
    topic === 'finance' ? 'markets stocks bonds earnings today' : '',
    topic === 'politics' ? 'top political stories today' : '',
    topic === 'tech' ? 'top technology news today' : '',
  ].filter(Boolean);

  let res: any = null;
  try {
    res = await (tavilyWebSearch as any)({ queries, limit, recencyDays, topic: 'news' } as TavilyOpts);
  } catch {
    res = await (tavilyWebSearch as any)(queries.join(' OR '), { limit, recencyDays, topic: 'news' });
  }

  const items: NewsItem[] = Array.isArray(res?.items) ? res.items : [];
  if (!items.length) return { text: 'No fresh headlines found right now.', sources: [] as string[] };

  // Dedup by canonical URL
  const seen = new Map<string, NewsItem>();
  for (const it of items) {
    const raw = String(it.url || '');
    if (!raw) continue;
    let key = raw;
    try {
      const u = new URL(raw);
      u.hash = ''; u.search = '';
      key = u.toString();
    } catch {}
    if (!seen.has(key)) seen.set(key, it);
    if (seen.size >= limit) break;
  }
  const top = Array.from(seen.values());

  const bullets = top.map((it) => {
    let host = '';
    try { host = new URL(it.url).host.replace(/^www\./, ''); } catch {}
    const when = it.published_at ? ` • ${new Date(it.published_at).toUTCString()}` : '';
    return `- ${it.title || 'Untitled'}${host ? ` (${host})` : ''}${when}`;
  });

  const header = topic === 'finance' ? 'Latest finance/markets headlines:' : 'Latest headlines:';
  const text = [
    header,
    '',
    ...bullets,
    '',
    'Sources:',
    ...top.map((it) => `- ${it.title || it.url}: ${it.url}`),
  ].join('\n');

  return { text, sources: top.map((it) => it.url) };
}

/* ========= Full-article extraction (server) ========= */
// Use dynamic imports so Next.js won’t try to bundle jsdom/readability in edge/client builds.
async function fetchAndExtract(url: string): Promise<{ text: string; title?: string } | null> {
  try {
    const { JSDOM } = await import('jsdom');
    const { Readability } = await import('@mozilla/readability');

    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SolaceNewsBot/1.0)' },
    });
    if (!r.ok) return null;

    const html = await r.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article) return null;

    const clean = (article.textContent || '').trim();
    if (!clean) return null;

    return { text: clean, title: article.title };
  } catch {
    return null;
  }
}

/* ========= Summarization primitives ========= */

async function summarizeItem({
  title,
  snippet,
  url,
  source,
}: {
  title: string;
  snippet?: string;
  url: string;
  source?: string;
}): Promise<string> {
  const base = `Title: ${title}
Source: ${source || ''}
URL: ${url}
Excerpt: ${snippet || ''}`.trim();

  const sys = `You are a neutral news summarizer. Write 3–5 sentences.
- No hype, no opinion.
- Include who/what/where/when and any confirmed cause/effect.
- If uncertainty exists, say so plainly.
- Do NOT invent facts.`;

  try {
    if (process.env.SOLACE_API_URL && process.env.SOLACE_API_KEY) {
      const out = await withTimeout(
        solaceNonStream({
          mode: 'news',
          system: sys,
          messages: [{ role: 'user', content: base }],
          temperature: 0.0,
        }),
        12_000
      );
      return (out || '').trim();
    }
    const openai: OpenAI = await getOpenAI();
    const r = await withTimeout(
      openai.responses.create({
        model: MODEL,
        input: `${sys}\n\n${base}`,
        max_output_tokens: 220,
        temperature: 0.0,
      }),
      12_000
    );
    return ((r as any).output_text || '').trim();
  } catch {
    return snippet || '';
  }
}

async function buildNeutralArticle(stories: NewsStory[]): Promise<string> {
  const stitched = stories
    .map((s, i) => [
      `# Item ${i + 1}`,
      `Title: ${s.title}`,
      s.published_at ? `Published: ${s.published_at}` : '',
      `Source: ${s.source || ''}`,
      `URL: ${s.url}`,
      `Summary: ${s.summary}`,
    ].filter(Boolean).join('\n'))
    .join('\n\n');

  const sys = `You are a neutral news synthesizer.
Write a single, bias-removed article (6–10 sentences) that integrates all items.
Rules:
- No adjectives that signal approval/disapproval.
- State only claims present across the inputs; if outlets disagree, say that explicitly.
- Include who/what/where/when, consequences, and what is confirmed vs. uncertain.
- No rhetorical questions, no advice, no speculation.`;

  try {
    if (process.env.SOLACE_API_URL && process.env.SOLACE_API_KEY) {
      const out = await withTimeout(
        solaceNonStream({
          mode: 'news',
          system: sys,
          messages: [{ role: 'user', content: stitched }],
          temperature: 0.0,
        }),
        12_000
      );
      return (out || '').trim();
    }
    const openai: OpenAI = await getOpenAI();
    const r = await withTimeout(
      openai.responses.create({
        model: MODEL,
        input: `${sys}\n\n${stitched}`,
        max_output_tokens: 500,
        temperature: 0.0,
      }),
      12_000
    );
    return ((r as any).output_text || '').trim();
  } catch {
    return stories.map(s => s.summary).join(' ');
  }
}

/* ========= Engaging-but-impartial full rewrites ========= */

async function rewriteFullArticle(params: {
  title: string;
  url: string;
  source?: string;
  published_at?: string;
  fullText?: string;      // extracted
  fallbackSummary?: string;
}): Promise<RewrittenArticle | null> {
  const { title, url, source, published_at, fullText, fallbackSummary } = params;

  const material = (fullText && fullText.length > 800) ? fullText : (fallbackSummary || '');
  if (!material) return null;

  const sys = `You are a news writer. Rewrite the input into an engaging but strictly impartial article.
Style & Rules:
- 8–14 sentences, crisp and readable for a general audience.
- Keep it entertaining via pacing, structure, and clarity — not adjectives that imply judgment.
- No hype, no loaded language, no rhetorical questions.
- Attribute facts where relevant ("according to ...", "the agency said ...").
- If uncertainty or dispute exists, state it clearly.
- Absolutely NO fabrication; use only the provided material.
- End with numbered reference markers like [1], then provide a "References" list (numbered) with titles and URLs.`;

  const user = `Title: ${title}
Source: ${source || ''}
URL: ${url}

Content:
${material}`;

  try {
    let rewritten = '';
    if (process.env.SOLACE_API_URL && process.env.SOLACE_API_KEY) {
      rewritten = await withTimeout(
        solaceNonStream({
          mode: 'news',
          system: sys,
          messages: [{ role: 'user', content: user }],
          temperature: 0.1,
        }),
        14_000
      );
    } else {
      const openai: OpenAI = await getOpenAI();
      const r = await withTimeout(
        openai.responses.create({
          model: MODEL,
          input: `${sys}\n\n${user}`,
          max_output_tokens: 900,
          temperature: 0.1,
        }),
        14_000
      );
      rewritten = ((r as any).output_text || '').trim();
    }

    const references = [{ label: '[1]', url, source, title }];

    return {
      title,
      url,
      source,
      published_at,
      rewritten: (rewritten || '').trim(),
      references,
    };
  } catch {
    return null;
  }
}

function normalizeSourcesForLinks(stories: { title: string; url: string; source?: string }[]) {
  const seen = new Set<string>();
  const out: { title: string; url: string; source?: string }[] = [];
  for (const s of stories) {
    const raw = s.url || '';
    if (!raw) continue;
    let key = raw;
    try { const u = new URL(raw); u.hash = ''; u.search = ''; key = u.toString(); } catch {}
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ title: s.title || key, url: key, source: s.source });
  }
  return out;
}

/* ========= Public: build payload used by the route ========= */

export async function buildNewsPayload(q: string, topic: Topic, _opts?: { allowWebSearch?: boolean }) {
  const { text: digestText, sources } = await buildNewsDigest({
    query: q,
    topic,
    limit: 6,
    recencyDays: topic === 'finance' ? 1 : 2,
  });

  let res: any = null;
  try {
    res = await (tavilyWebSearch as any)({ queries: q, limit: 6, recencyDays: topic === 'finance' ? 1 : 2, topic: 'news' } as TavilyOpts);
  } catch {
    res = await (tavilyWebSearch as any)(q, { limit: 6, recencyDays: topic === 'finance' ? 1 : 2, topic: 'news' });
  }
  const rawItems: NewsItem[] = Array.isArray(res?.items) ? res.items : [];

  const stories: NewsStory[] = [];
  for (const it of rawItems) {
    const summary = await summarizeItem({
      title: it.title,
      snippet: it.snippet,
      url: it.url,
      source: it.source,
    });
    stories.push({
      title: it.title,
      url: it.url,
      source: it.source,
      published_at: it.published_at,
      summary,
    });
  }

  const neutral_article = await buildNeutralArticle(stories);
  const normalized_sources = normalizeSourcesForLinks(stories);

  const toRewrite = stories.slice(0, 3);
  const rewritten_articles: RewrittenArticle[] = [];
  for (const s of toRewrite) {
    let extracted: { text: string; title?: string } | null = null;
    try {
      extracted = await fetchAndExtract(s.url);
    } catch {
      extracted = null;
    }
    const rewritten = await rewriteFullArticle({
      title: s.title,
      url: s.url,
      source: s.source,
      published_at: s.published_at,
      fullText: extracted?.text,
      fallbackSummary: s.summary,
    });
    if (rewritten) rewritten_articles.push(rewritten);
  }

  return {
    digestText,
    sources,
    news_items: stories,
    neutral_article,
    normalized_sources,
    rewritten_articles,
  };
}

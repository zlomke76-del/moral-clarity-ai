// lib/research.ts

import { webSearch, type TavilyItem } from '@/lib/search';

export type ResearchPack = {
  /**
   * High-level source bullets suitable for RESEARCH CONTEXT, e.g.:
   * [R1] Title — https://example.com
   */
  bullets: string[];

  /**
   * Primary URL associated with this research query, if any.
   * Used by ledgers / logging and as an anchor in the prompt.
   */
  url?: string | null;

  /**
   * A text snapshot from the best source (usually the primary URL),
   * used to seed the WEBSITE TEXT SNAPSHOT block in the system prompt.
   */
  urlTextSnippet?: string | null;

  /**
   * Raw, normalized search results for downstream logging / analysis.
   * Currently this is just the TavilyItem[] array.
   */
  raw?: any;
};

export type ResearchOpts = {
  /**
   * Override the default max results (default 5).
   */
  maxResults?: number;

  /**
   * If you already know the URL the user cares about, you can hint it here.
   * We'll try to choose content from this URL when building urlTextSnippet.
   */
  preferUrl?: string | null;

  /**
   * Optional flags for news-style queries; passed through to webSearch.
   */
  news?: boolean;
  days?: number;
};

/**
 * Lightweight "deep research" helper.
 *
 * Responsibilities:
 * - Call webSearch() to hit Tavily.
 * - Build human-readable [R1]/[R2] bullets for the RESEARCH CONTEXT section.
 * - Select a primary URL.
 * - Extract a compact text snippet (urlTextSnippet) from the richest result,
 *   so Solace actually has something to read / analyze.
 *
 * NEVER throws: on any error it returns an empty pack with raw = null.
 */
export async function runDeepResearch(
  query: string,
  opts: ResearchOpts = {}
): Promise<ResearchPack> {
  try {
    const q = query?.trim();
    if (!q) {
      return {
        bullets: [],
        url: null,
        urlTextSnippet: null,
        raw: null,
      };
    }

    const max = opts.maxResults ?? 5;

    const results: TavilyItem[] = await webSearch(q, {
      max,
      news: opts.news,
      days: opts.days,
    });

    if (!results || results.length === 0) {
      return {
        bullets: [],
        url: null,
        urlTextSnippet: null,
        raw: [],
      };
    }

    // 1) Build [R1] / [R2] bullets
    const bullets = results.map((r, i) => {
      const title = r.title || '(untitled)';
      const url = r.url || '';
      const src = url ? ` — ${url}` : '';
      return `[R${i + 1}] ${title}${src}`;
    });

    // 2) Choose primary URL
    let primaryUrl: string | null = null;

    if (opts.preferUrl && typeof opts.preferUrl === 'string') {
      primaryUrl = opts.preferUrl;
    } else {
      const withUrl = results.find((r) => !!r.url);
      primaryUrl = withUrl?.url ?? null;
    }

    // 3) Pick the best content source for the snippet
    const normalize = (text: string) =>
      text
        .replace(/\s+/g, ' ')
        .replace(/\u00a0/g, ' ')
        .trim();

    let bestContent: string | null = null;

    // Prefer the result whose URL matches primaryUrl (if any)
    if (primaryUrl) {
      const match = results.find((r) => r.url === primaryUrl && r.content && r.content.trim());
      if (match?.content) {
        bestContent = match.content;
      }
    }

    // Fallback: first result with non-empty content
    if (!bestContent) {
      const firstWithContent = results.find((r) => r.content && r.content.trim());
      if (firstWithContent?.content) {
        bestContent = firstWithContent.content;
      }
    }

    const SNIPPET_MAX_CHARS = 2000;
    const urlTextSnippet =
      bestContent && bestContent.trim().length
        ? normalize(bestContent).slice(0, SNIPPET_MAX_CHARS)
        : null;

    return {
      bullets,
      url: primaryUrl,
      urlTextSnippet,
      raw: results,
    };
  } catch (err) {
    console.error('[runDeepResearch] Unexpected error', err);
    return {
      bullets: [],
      url: null,
      urlTextSnippet: null,
      raw: null,
    };
  }
}

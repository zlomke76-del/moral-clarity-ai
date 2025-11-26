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
   * used to seed the WEBSITE TEXT SNAPSHOT (or similar) block in the
   * system prompt.
   *
   * For URL/domain-style queries, this may contain a structured
   * WEBSITE_SNAPSHOT (JSON) block so Solace can apply the strict
   * website review protocol.
   */
  urlTextSnippet?: string | null;

  /**
   * Raw, normalized search results for downstream logging / analysis.
   * Historically this was TavilyItem[]; we now allow richer payloads
   * but keep the type as any for compatibility.
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
   * We'll try to choose content from this URL when building urlTextSnippet
   * and when constructing a website snapshot.
   */
  preferUrl?: string | null;

  /**
   * Optional flags for news-style queries; passed through to webSearch.
   */
  news?: boolean;
  days?: number;
};

/* -------------------------------------------------------
   Helpers — URL / domain detection
-------------------------------------------------------- */

function looksLikeUrlOrDomain(input: string | null | undefined): boolean {
  if (!input) return false;
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return false;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return true;
  }
  // crude but safe domain heuristic: something like foo.com, bar.co.uk, etc.
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmed);
}

function normalizeDomain(input: string): string | null {
  try {
    let url = input.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    const u = new URL(url);
    return u.hostname.toLowerCase();
  } catch {
    return null;
  }
}

type WebsitePageSnapshot = {
  url: string;
  title: string | null;
  snippet: string | null;
};

type WebsiteSnapshotPayload = {
  kind: 'website';
  query: string;
  domain: string;
  depth: 'basic' | 'advanced';
  pages: WebsitePageSnapshot[];
  generated_at: string;
};

/* -------------------------------------------------------
   Core helper
-------------------------------------------------------- */

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
 * For URL/domain-style queries:
 * - Additionally build a structured WEBSITE_SNAPSHOT (JSON) payload that
 *   enumerates visible pages (depth-1, same-domain) and inject that into
 *   urlTextSnippet so the website review protocol can engage.
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

    // 1) Build [R1] / [R2] bullets (generic, works for all queries)
    const bullets = results.map((r, i) => {
      const title = r.title || '(untitled)';
      const url = r.url || '';
      const src = url ? ` — ${url}` : '';
      return `[R${i + 1}] ${title}${src}`;
    });

    // 2) Choose primary URL (for logging and anchoring)
    let primaryUrl: string | null = null;

    if (opts.preferUrl && typeof opts.preferUrl === 'string') {
      primaryUrl = opts.preferUrl;
    } else {
      const withUrl = results.find((r) => !!r.url);
      primaryUrl = withUrl?.url ?? null;
    }

    // 3) Decide if this should be treated as a "website snapshot" query.
    const urlLikeQuery = looksLikeUrlOrDomain(q);
    const urlLikeHint = looksLikeUrlOrDomain(opts.preferUrl);

    const websiteMode = urlLikeQuery || urlLikeHint;

    // Normalization helper
    const normalize = (text: string) =>
      text
        .replace(/\s+/g, ' ')
        .replace(/\u00a0/g, ' ')
        .trim();

    // If this is a website-style query, build a WEBSITE_SNAPSHOT payload
    // and embed it into urlTextSnippet. Otherwise, fall back to the
    // original "best content snippet" behavior.
    if (websiteMode) {
      const domainSource = opts.preferUrl && urlLikeHint ? opts.preferUrl : q;
      const domain = normalizeDomain(domainSource) ?? 'unknown';
      const now = new Date().toISOString();

      const pages: WebsitePageSnapshot[] = [];

      for (const item of results) {
        const url = typeof item?.url === 'string' ? item.url : null;
        if (!url) continue;

        if (domain && domain !== 'unknown') {
          try {
            const u = new URL(url);
            if (u.hostname.toLowerCase() !== domain) {
              continue;
            }
          } catch {
            continue;
          }
        }

        const title =
          typeof item?.title === 'string' && item.title.trim()
            ? item.title.trim()
            : null;

        const snippetSource =
          typeof item?.content === 'string' && item.content.trim()
            ? item.content.trim()
            : '';

        const SNIPPET_MAX_CHARS_PER_PAGE = 600;
        const snippet =
          snippetSource.length > SNIPPET_MAX_CHARS_PER_PAGE
            ? snippetSource.slice(0, SNIPPET_MAX_CHARS_PER_PAGE) + '…'
            : snippetSource || null;

        pages.push({
          url,
          title,
          snippet,
        });
      }

      const websiteSnapshot: WebsiteSnapshotPayload = {
        kind: 'website',
        query: q,
        domain,
        depth: 'basic',
        pages,
        generated_at: now,
      };

      const websiteJson = JSON.stringify(websiteSnapshot, null, 2);

      const urlTextSnippet =
        pages.length === 0
          ? `WEBSITE_SNAPSHOT (JSON):

"""json
{
  "kind": "website",
  "query": ${JSON.stringify(q)},
  "domain": ${JSON.stringify(domain)},
  "depth": "basic",
  "pages": [],
  "generated_at": ${JSON.stringify(now)}
}
"""`.trim()
          : `WEBSITE_SNAPSHOT (JSON):

"""json
${websiteJson}
"""`.trim();

      // If we have at least one same-domain page, use that as primaryUrl.
      if (!primaryUrl && pages.length > 0) {
        primaryUrl = pages[0].url;
      }

      return {
        bullets,
        url: primaryUrl,
        urlTextSnippet,
        raw: {
          kind: 'website',
          snapshot: websiteSnapshot,
          items: results,
        },
      };
    }

    // ---- Non-website queries: original behavior ----

    let bestContent: string | null = null;

    // Prefer the result whose URL matches primaryUrl (if any)
    if (primaryUrl) {
      const match = results.find(
        (r) => r.url === primaryUrl && r.content && r.content.trim()
      );
      if (match?.content) {
        bestContent = match.content;
      }
    }

    // Fallback: first result with non-empty content
    if (!bestContent) {
      const firstWithContent = results.find(
        (r) => r.content && r.content.trim()
      );
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


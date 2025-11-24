// lib/research.ts

import { webSearch, type TavilyItem } from '@/lib/search';

export type ResearchPack = {
  bullets: string[];
  url?: string | null;
  urlTextSnippet?: string | null;
  raw?: any;
};

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

function extractUrlFromQuery(query: string): string | null {
  if (!query) return null;
  const m = query.match(URL_REGEX);
  if (!m) return null;

  let raw = m[0];
  if (!raw.startsWith('http')) {
    raw = `https://${raw}`;
  }

  try {
    const u = new URL(raw);
    return u.toString();
  } catch {
    return null;
  }
}

function hostnameFrom(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function pickPrimaryItem(query: string, results: TavilyItem[]): {
  primary: TavilyItem | null;
  primaryUrl: string | null;
  snippetSource: TavilyItem | null;
} {
  if (!results.length) {
    return { primary: null, primaryUrl: null, snippetSource: null };
  }

  const queryUrl = extractUrlFromQuery(query);
  const queryHost = hostnameFrom(queryUrl);

  let primary: TavilyItem | null = null;

  // 1) If user mentioned a URL, prefer a result whose host matches
  if (queryHost) {
    primary =
      results.find((r) => {
        const h = hostnameFrom(r.url);
        return h === queryHost || (h && queryHost && h.endsWith(queryHost));
      }) || null;
  }

  // 2) Otherwise: prefer first result that has both url and content
  if (!primary) {
    primary =
      results.find((r) => r.url && (r.content && r.content.trim().length > 0)) ||
      null;
  }

  // 3) Fallback: just the first result
  if (!primary) {
    primary = results[0];
  }

  const primaryUrl = primary?.url || null;

  // Snippet source: ideally the primary item with content, else first contentful item
  let snippetSource: TavilyItem | null = null;
  if (primary && primary.content && primary.content.trim().length > 0) {
    snippetSource = primary;
  } else {
    snippetSource =
      results.find((r) => r.content && r.content.trim().length > 0) || null;
  }

  return { primary, primaryUrl, snippetSource };
}

/**
 * Deep research helper used by Solace.
 *
 * Responsibilities:
 * - Run Tavily search.
 * - Return:
 *   - [R1], [R2], ... bullets including titles, URLs, and SHORT snippets.
 *   - A primary URL (best guess at "the main site" for this query).
 *   - A LONGER text snippet (urlTextSnippet) from the most relevant result,
 *     so the assistant can actually quote and analyze real content.
 * - Preserve `raw` results so downstream ledgers can log and inspect.
 */
export async function runDeepResearch(query: string): Promise<ResearchPack> {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return {
      bullets: [],
      url: null,
      urlTextSnippet: null,
      raw: null,
    };
  }

  // Tavily search (can be website, reviews, etc.)
  const results = await webSearch(trimmed, { max: 5 });

  if (!results || results.length === 0) {
    return {
      bullets: [],
      url: null,
      urlTextSnippet: null,
      raw: [],
    };
  }

  const { primaryUrl, snippetSource } = pickPrimaryItem(trimmed, results);

  // Build [R1] bullets with short embedded snippets
  const bullets: string[] = results.map((r, i) => {
    const label = `[R${i + 1}]`;
    const title = r.title || '(untitled)';
    const url = r.url || '';
    const src = url ? ` — ${url}` : '';

    const rawSnippet =
      (r.content || '').trim().replace(/\s+/g, ' '); // collapse whitespace

    const maxSnippetLen = 400;
    const shortSnippet =
      rawSnippet.length > 0
        ? `\n${rawSnippet.slice(0, maxSnippetLen)}${
            rawSnippet.length > maxSnippetLen ? '…' : ''
          }`
        : '';

    return `${label} ${title}${src}${shortSnippet}`;
  });

  // Longer snippet from the primary / best contentful result
  let urlTextSnippet: string | null = null;
  if (snippetSource && snippetSource.content) {
    const raw = snippetSource.content.trim();
    if (raw.length > 0) {
      // Give the assistant a fairly rich chunk, but avoid blowing up context
      const maxLen = 4000;
      urlTextSnippet =
        raw.length > maxLen ? `${raw.slice(0, maxLen)}…` : raw;
    }
  }

  return {
    bullets,
    url: primaryUrl,
    urlTextSnippet,
    raw: results,
  };
}

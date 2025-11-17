// lib/research.ts

import { webSearch } from '@/lib/search';

export type ResearchPack = {
  bullets: string[];
  urlTextSnippet?: string | null;
  raw?: any;
};

/**
 * Lightweight "deep research" helper.
 *
 * For now this is intentionally simple:
 * - Runs a web search.
 * - Returns bullet-style references plus raw results.
 *
 * It’s designed so we can later plug in a heavier,
 * multi-step research pipeline without changing callers.
 */
export async function runDeepResearch(query: string): Promise<ResearchPack> {
  if (!query?.trim()) {
    return { bullets: [], urlTextSnippet: null, raw: null };
  }

  const results = await webSearch(query, { max: 5 });

  const bullets =
    results?.map((r, i) => {
      const title = r.title || '(untitled)';
      const url = r.url || '';
      const src = url ? ` — ${url}` : '';
      return `[R${i + 1}] ${title}${src}`;
    }) ?? [];

  return {
    bullets,
    urlTextSnippet: null,
    raw: results,
  };
}

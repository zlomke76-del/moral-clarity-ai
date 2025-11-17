// lib/research.ts
import { webSearch, type TavilyItem } from '@/lib/search';

export type ResearchPack = {
  bullets: string[];
  urlTextSnippet?: string;
  url?: string | null;
};

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

function normalizeUrl(url: string): string {
  let u = (url || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) {
    u = 'https://' + u.replace(/^\/+/, '');
  }
  return u;
}

async function fetchUrlText(url: string): Promise<string> {
  const normalized = normalizeUrl(url);
  if (!normalized) return '';
  try {
    const r = await fetch(normalized);
    if (!r.ok) {
      console.error('[research] fetchUrlText HTTP error', {
        status: r.status,
        statusText: r.statusText,
        url: normalized,
      });
      return '';
    }
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes('html') && !ct.includes('text')) {
      // Not a typical web page; skip
      return '';
    }
    const html = await r.text();

    // Very simple HTML → text stripper (we're not aiming for perfection here)
    let stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<\/(p|div|br|li|h[1-6])>/gi, '\n')
      .replace(/<\/?[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Truncate to keep tokens reasonable
    const MAX_CHARS = 4000;
    if (stripped.length > MAX_CHARS) {
      stripped = stripped.slice(0, MAX_CHARS) + '\n[...truncated webpage text...]';
    }

    return stripped;
  } catch (err) {
    console.error('[research] fetchUrlText unexpected error', { url: normalized, err });
    return '';
  }
}

function extractFirstUrl(text: string): string | null {
  if (!text) return null;
  const m = text.match(URL_REGEX);
  return m ? m[0] : null;
}

function dedupeByUrl(items: TavilyItem[]): TavilyItem[] {
  const seen = new Set<string>();
  const out: TavilyItem[] = [];
  for (const it of items) {
    const key = (it.url || '').trim();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

/**
 * Run a deeper research pass:
 * - Multiple Tavily calls (general + news)
 * - Deduplicate
 * - Build a bullet list of sources
 * - Optionally fetch raw page text if a URL is present in the user query
 */
export async function runDeepResearch(userQuery: string): Promise<ResearchPack> {
  const query = userQuery || '';
  const urlInQuery = extractFirstUrl(query);

  // Parallel Tavily calls: general + news (if any)
  const [general, news] = await Promise.all([
    webSearch(query, { max: 6 }),
    webSearch(query, { news: true, max: 6 }),
  ]);

  const merged = dedupeByUrl([...(general || []), ...(news || [])]).slice(0, 10);

  const bullets: string[] = merged.map((r, i) => {
    const idx = i + 1;
    const title = r.title || r.url || 'result';
    const url = r.url || '';
    return `[R${idx}] ${title} — ${url}`;
  });

  let urlTextSnippet: string | undefined;
  if (urlInQuery) {
    const txt = await fetchUrlText(urlInQuery);
    if (txt) urlTextSnippet = txt;
  }

  return {
    bullets,
    urlTextSnippet,
    url: urlInQuery,
  };
}

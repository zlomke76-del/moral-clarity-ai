// lib/search.ts
type TavilyOpts = {
  max?: number;
  news?: boolean;
  days?: number;     // for news window
};

type TavilyItem = {
  title: string;
  url: string;
  content?: string;
  score?: number;
  published_date?: string;
};

const TAVILY_URL = "https://api.tavily.com/search";
const TVLY_KEY = process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY || "";

export async function webSearch(query: string, opts: TavilyOpts = {}): Promise<TavilyItem[]> {
  if (!query?.trim()) return [];
  if (!TVLY_KEY) return []; // silently no-op if not configured

  const body: any = {
    api_key: TVLY_KEY,
    query,
    search_depth: "basic",
    max_results: Math.max(1, Math.min(opts.max ?? 5, 10)),
  };

  if (opts.news) {
    body.search_type = "news";
    if (opts.days) body.days = opts.days;
  }

  const r = await fetch(TAVILY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) return [];
  const j = await r.json().catch(() => null);
  const items: any[] = j?.results || j?.news || [];
  return items.map((x) => ({
    title: x.title || x.url || "result",
    url: x.url,
    content: x.content || x.snippet || "",
    score: x.score,
    published_date: x.published_date,
  }));
}

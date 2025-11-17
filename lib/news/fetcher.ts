// lib/news/fetcher.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient, type PostgrestError } from '@supabase/supabase-js';
import { webSearch } from '@/lib/search';
import { extractArticle } from '@/lib/news/extract';

/* ========= ENV / SUPABASE INIT ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[news/fetcher] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing – fetcher will throw at runtime.'
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

/* ========= DEFAULT NEWS CONFIG ========= */

const DEFAULT_WORKSPACE_ID = process.env.MCA_WORKSPACE_ID || 'global_news';
const DEFAULT_USER_KEY = 'system-news-anchor';

// Overall target per refresh (after dedupe + failures)
const DEFAULT_STORIES_TARGET = 60;

// Max per domain in final batch
const DEFAULT_PER_DOMAIN_MAX = 5;

// How far back we allow the news pull to look (in days)
const DEFAULT_NEWS_WINDOW_DAYS = 1;

// Rough cap of how many Tavily "global" items we allow
const GLOBAL_TOP_MAX = 15;

/* ========= TYPES ========= */

export type NewsSource = {
  id: string;
  label: string;
  domain: string;
  country?: string;
  notes?: string;
};

export type FetcherArticleCandidate = {
  title: string;
  url: string;
  content?: string;
  sourceDomain: string;
  query: string;
};

export type DomainStats = {
  domain: string;
  attempted: number;
  deduped: number;
  inserted: number;
  failed: number;
};

export type FetcherResult = {
  ok: boolean;
  workspaceId: string;
  userKey: string;
  startedAt: string;
  finishedAt: string;
  totalCandidates: number;
  totalInserted: number;
  totalFailed: number;
  distinctDomains: number;
  domainStats: Record<string, DomainStats>;
  errors: string[];
};

/* ========= SOURCE REGISTRY ========= */
/**
 * All outlets are equal from a bias perspective.
 * This registry is simply "who is eligible", not ideological.
 */
export const SOURCE_REGISTRY: NewsSource[] = [
  // U.S. mainstream
  { id: 'ap', label: 'AP News', domain: 'apnews.com' },
  { id: 'reuters', label: 'Reuters', domain: 'reuters.com' },
  { id: 'bloomberg', label: 'Bloomberg', domain: 'bloomberg.com' },
  { id: 'wsj', label: 'Wall Street Journal', domain: 'wsj.com' },
  { id: 'nyt', label: 'New York Times', domain: 'nytimes.com' },
  { id: 'wapo', label: 'Washington Post', domain: 'washingtonpost.com' },
  { id: 'usatoday', label: 'USA Today', domain: 'usatoday.com' },
  { id: 'npr', label: 'NPR', domain: 'npr.org' },
  { id: 'axios', label: 'Axios', domain: 'axios.com' },
  { id: 'politico', label: 'Politico', domain: 'politico.com' },
  { id: 'thehill', label: 'The Hill', domain: 'thehill.com' },
  { id: 'time', label: 'Time', domain: 'time.com' },
  { id: 'forbes', label: 'Forbes', domain: 'forbes.com' },

  // U.S. broadcasters
  { id: 'abc', label: 'ABC News', domain: 'abcnews.go.com' },
  { id: 'cbs', label: 'CBS News', domain: 'cbsnews.com' },
  { id: 'nbc', label: 'NBC News', domain: 'nbcnews.com' },
  { id: 'pbs', label: 'PBS', domain: 'pbs.org' },
  { id: 'fox', label: 'Fox News', domain: 'foxnews.com' },
  { id: 'cnn', label: 'CNN', domain: 'cnn.com' },
  { id: 'msnbc', label: 'MSNBC', domain: 'msnbc.com' },
  { id: 'newsnation', label: 'NewsNation', domain: 'newsnationnow.com' },

  // U.S. right-leaning (eligible, not weighted)
  { id: 'newsmax', label: 'Newsmax', domain: 'newsmax.com' },
  { id: 'dailycaller', label: 'Daily Caller', domain: 'dailycaller.com' },
  { id: 'federalist', label: 'The Federalist', domain: 'thefederalist.com' },
  {
    id: 'washingtonexaminer',
    label: 'Washington Examiner',
    domain: 'washingtonexaminer.com',
  },

  // U.S. left-leaning (eligible, not weighted)
  { id: 'huffpost', label: 'HuffPost', domain: 'huffpost.com' },
  { id: 'guardian-us', label: 'The Guardian (US)', domain: 'theguardian.com' },
  { id: 'atlantic', label: 'The Atlantic', domain: 'theatlantic.com' },
  { id: 'motherjones', label: 'Mother Jones', domain: 'motherjones.com' },

  // International
  { id: 'bbc', label: 'BBC', domain: 'bbc.com', country: 'UK' },
  { id: 'aljazeera', label: 'Al Jazeera', domain: 'aljazeera.com', country: 'QA' },
  { id: 'times-uk', label: 'The Times (UK)', domain: 'thetimes.co.uk', country: 'UK' },
  { id: 'telegraph', label: 'The Telegraph', domain: 'telegraph.co.uk', country: 'UK' },
  { id: 'independent', label: 'The Independent', domain: 'independent.co.uk', country: 'UK' },
  { id: 'france24', label: 'France 24', domain: 'france24.com', country: 'FR' },
  { id: 'dw', label: 'Deutsche Welle', domain: 'dw.com', country: 'DE' },
  { id: 'nikkei', label: 'Nikkei Asia', domain: 'nikkei.com', country: 'JP' },
];

/* ========= SMALL HELPERS ========= */

function clampSummary(text: string | undefined, max = 1200): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max) + '\n[...truncated for storage...]';
}

function clampLong(text: string | undefined, max = 4000): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max) + '\n[...truncated...]';
}

function extractDomainFromUrl(url: string): string {
  if (!url) return 'unknown';
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    return host.startsWith('www.') ? host.slice(4) : host;
  } catch {
    return 'unknown';
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

/* ========= TRUTH_FACTS ROW BUILDER ========= */

function buildTruthFactRow(opts: {
  workspaceId: string;
  userKey: string;
  query: string;
  title: string;
  url: string;
  fullText: string;
  tavilyContent?: string;
}): Record<string, unknown> {
  const { workspaceId, userKey, query, title, url, fullText, tavilyContent } = opts;

  const summarySource = fullText || tavilyContent || title;
  const summary = clampSummary(summarySource);

  const sourcesPayload = [
    {
      kind: 'news',
      title,
      url,
      fetched_at: nowIso(),
    },
  ];

  const now = nowIso();

  return {
    workspace_id: workspaceId,
    user_key: userKey,
    user_id: null,
    query,
    summary,

    // Neutral defaults for now; these will be replaced by the scoring engine.
    pi_score: 0.5,
    confidence_level: 'medium',

    scientific_domain: 'news',
    category: 'news_story',
    status: 'snapshot',

    sources: JSON.stringify(sourcesPayload),
    raw_url: url,
    raw_snapshot: clampLong(fullText || tavilyContent || '', 4000),

    created_at: now,
    updated_at: now,
  };
}

/* ========= SAMPLING HELPERS ========= */

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickSourcesForRefresh(
  registry: NewsSource[],
  storiesTarget: number,
  perDomainMax: number,
  minDistinct: number
): NewsSource[] {
  const needed = Math.max(minDistinct, Math.ceil(storiesTarget / perDomainMax));
  const pool = shuffle(registry);
  return pool.slice(0, Math.min(needed, pool.length));
}

/* ========= MAIN FETCH LOGIC ========= */

/**
 * Run a single refresh cycle:
 * - Selects a diverse subset of sources from SOURCE_REGISTRY
 * - Uses Tavily (webSearch) per-domain with simple domain-focused queries
 * - Applies per-domain caps and dedupe
 * - Extracts article text via the shared extractArticle() helper
 * - Inserts into truth_facts
 */
export async function runNewsFetchRefresh(opts?: {
  workspaceId?: string;
  userKey?: string;
  storiesTarget?: number;
  perDomainMax?: number;
  newsWindowDays?: number;
}): Promise<FetcherResult> {
  if (!supabaseAdmin) {
    throw new Error(
      '[news/fetcher] Supabase admin client not initialized – missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  const workspaceId = opts?.workspaceId || DEFAULT_WORKSPACE_ID;
  const userKey = opts?.userKey || DEFAULT_USER_KEY;
  const storiesTarget = opts?.storiesTarget ?? DEFAULT_STORIES_TARGET;
  const perDomainMax = opts?.perDomainMax ?? DEFAULT_PER_DOMAIN_MAX;
  const newsWindowDays = opts?.newsWindowDays ?? DEFAULT_NEWS_WINDOW_DAYS;

  const startedAt = nowIso();
  const errors: string[] = [];
  const domainStats: Record<string, DomainStats> = {};

  // 1) Choose which sources to sample this cycle
  const selectedSources = pickSourcesForRefresh(
    SOURCE_REGISTRY,
    storiesTarget,
    perDomainMax,
    /* minDistinct */ 15
  );

  // 2) Fetch candidates per source via Tavily
  const allCandidates: FetcherArticleCandidate[] = [];

  for (const source of selectedSources) {
    const domain = source.domain;
    domainStats[domain] = domainStats[domain] || {
      domain,
      attempted: 0,
      deduped: 0,
      inserted: 0,
      failed: 0,
    };

    // Domain-focused query. We keep it simple and allow Tavily to interpret it.
    const query = `latest news from ${source.label} (${domain}) today`;

    let items: any[] = [];
    try {
      items = await webSearch(query, {
        news: true,
        max: perDomainMax * 2, // oversample slightly before dedupe
        days: newsWindowDays,
      });
    } catch (err: any) {
      console.error('[news/fetcher] webSearch failed for domain', domain, err);
      errors.push(
        `webSearch failed for ${domain}: ${err?.message || String(err)}`
      );
      continue;
    }

    for (const item of items) {
      const title: string = item.title || '(untitled)';
      const url: string = item.url || '';
      if (!url) continue;

      const candidateDomain = extractDomainFromUrl(url);
      // Only keep if same or sub-domain of expected domain (basic guard)
      if (
        candidateDomain !== 'unknown' &&
        !candidateDomain.endsWith(domain.replace(/^www\./i, ''))
      ) {
        continue;
      }

      allCandidates.push({
        title,
        url,
        content: item.content,
        sourceDomain: candidateDomain,
        query,
      });
      domainStats[domain].attempted++;
    }
  }

  // 3) Optionally add a "global top news" layer (capped)
  try {
    const globalItems = await webSearch('top news headlines today', {
      news: true,
      max: GLOBAL_TOP_MAX,
      days: newsWindowDays,
    });

    for (const item of globalItems) {
      const title: string = item.title || '(untitled)';
      const url: string = item.url || '';
      if (!url) continue;

      const domain = extractDomainFromUrl(url);
      if (!domainStats[domain]) {
        domainStats[domain] = {
          domain,
          attempted: 0,
          deduped: 0,
          inserted: 0,
          failed: 0,
        };
      }

      allCandidates.push({
        title,
        url,
        content: item.content,
        sourceDomain: domain,
        query: 'top news headlines today',
      });
      domainStats[domain].attempted++;
    }
  } catch (err: any) {
    console.error('[news/fetcher] global top webSearch failed', err);
    errors.push(
      `global webSearch failed: ${err?.message || String(err)}`
    );
  }

  // 4) Deduplicate by URL and enforce per-domain caps
  const seenUrls = new Set<string>();
  const perDomainCounts: Record<string, number> = {};

  const deduped: FetcherArticleCandidate[] = [];

  for (const cand of shuffle(allCandidates)) {
    const urlKey = cand.url.trim();
    if (!urlKey || seenUrls.has(urlKey)) continue;

    const domain = cand.sourceDomain || extractDomainFromUrl(cand.url);
    perDomainCounts[domain] = perDomainCounts[domain] || 0;

    if (perDomainCounts[domain] >= perDomainMax) continue;

    seenUrls.add(urlKey);
    perDomainCounts[domain]++;

    deduped.push(cand);

    if (domainStats[domain]) {
      domainStats[domain].deduped++;
    }
  }

  // Truncate total to storiesTarget if we overshot
  const finalCandidates = deduped.slice(0, storiesTarget);

  // 5) Extract article text via extractArticle + insert into truth_facts
  let totalInserted = 0;
  let totalFailed = 0;

  for (const cand of finalCandidates) {
    const { url, title, content, sourceDomain, query } = cand;
    const domain = sourceDomain || extractDomainFromUrl(url);
    const stat = domainStats[domain] || {
      domain,
      attempted: 0,
      deduped: 0,
      inserted: 0,
      failed: 0,
    };
    domainStats[domain] = stat;

    try {
      const extracted = await extractArticle({
        url,
        tavilyContent: content,
        tavilyTitle: title,
      });

      if (!extracted.success || !extracted.clean_text?.trim()) {
        totalFailed++;
        stat.failed++;
        continue;
      }

      const fullText = extracted.clean_text;

      const factRow = buildTruthFactRow({
        workspaceId,
        userKey,
        query,
        title: extracted.title || title,
        url: extracted.url || url,
        fullText,
        tavilyContent: content,
      });

      const { error: insertErr } = await supabaseAdmin
        .from('truth_facts')
        .insert(factRow);

      if (insertErr) {
        console.error('[news/fetcher] truth_facts insert error', {
          url,
          message: (insertErr as PostgrestError).message,
          code: (insertErr as PostgrestError).code,
        });
        totalFailed++;
        stat.failed++;
        continue;
      }

      totalInserted++;
      stat.inserted++;
    } catch (err: any) {
      console.error('[news/fetcher] unexpected error inserting', url, err);
      totalFailed++;
      stat.failed++;
    }
  }

  const finishedAt = nowIso();

  return {
    ok: true,
    workspaceId,
    userKey,
    startedAt,
    finishedAt,
    totalCandidates: finalCandidates.length,
    totalInserted,
    totalFailed,
    distinctDomains: Object.keys(domainStats).length,
    domainStats,
    errors,
  };
}

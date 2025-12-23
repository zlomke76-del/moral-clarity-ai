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
const DEFAULT_STORIES_TARGET = 60;
const DEFAULT_PER_DOMAIN_MAX = 5;
const DEFAULT_NEWS_WINDOW_DAYS = 1;
const GLOBAL_TOP_MAX = 15;

/* ========= DOMAIN-SPECIFIC THROTTLES ========= */

const DOMAIN_MAX_OVERRIDES: Record<string, number> = {
  'rferl.org': 1,
};

/* ========= STRICTNESS ========= */

const MIN_ARTICLE_CHARS = 400;

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

export const SOURCE_REGISTRY: NewsSource[] = [
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

  { id: 'abc', label: 'ABC News', domain: 'abcnews.go.com' },
  { id: 'cbs', label: 'CBS News', domain: 'cbsnews.com' },
  { id: 'nbc', label: 'NBC News', domain: 'nbcnews.com' },
  { id: 'pbs', label: 'PBS', domain: 'pbs.org' },
  { id: 'fox', label: 'Fox News', domain: 'foxnews.com' },
  { id: 'cnn', label: 'CNN', domain: 'cnn.com' },
  { id: 'msnbc', label: 'MSNBC', domain: 'msnbc.com' },
  { id: 'newsnation', label: 'NewsNation', domain: 'newsnationnow.com' },

  { id: 'newsmax', label: 'Newsmax', domain: 'newsmax.com' },
  { id: 'dailycaller', label: 'Daily Caller', domain: 'dailycaller.com' },
  { id: 'federalist', label: 'The Federalist', domain: 'thefederalist.com' },
  { id: 'washingtonexaminer', label: 'Washington Examiner', domain: 'washingtonexaminer.com' },
  { id: 'huffpost', label: 'HuffPost', domain: 'huffpost.com' },
  { id: 'guardian', label: 'The Guardian', domain: 'theguardian.com' },
  { id: 'atlantic', label: 'The Atlantic', domain: 'theatlantic.com' },
  { id: 'motherjones', label: 'Mother Jones', domain: 'motherjones.com' },

  { id: 'ft', label: 'Financial Times', domain: 'ft.com' },
  { id: 'economist', label: 'The Economist', domain: 'economist.com' },
  { id: 'barrons', label: "Barron's", domain: 'barrons.com' },

  { id: 'courthouse', label: 'Courthouse News', domain: 'courthousenews.com' },
  { id: 'lawfare', label: 'Lawfare', domain: 'lawfaremedia.org' },
  { id: 'justsecurity', label: 'Just Security', domain: 'justsecurity.org' },

  { id: 'bbc', label: 'BBC', domain: 'bbc.com' },
  { id: 'aljazeera', label: 'Al Jazeera', domain: 'aljazeera.com' },
  { id: 'france24', label: 'France 24', domain: 'france24.com' },
  { id: 'dw', label: 'Deutsche Welle', domain: 'dw.com' },
  { id: 'spiegel', label: 'Der Spiegel', domain: 'spiegel.de' },
  { id: 'lemonde', label: 'Le Monde', domain: 'lemonde.fr' },
  { id: 'nikkei', label: 'Nikkei Asia', domain: 'nikkei.com' },

  { id: 'rfe', label: 'Radio Free Europe / Radio Liberty', domain: 'rferl.org' },
];

/* ========= HELPERS ========= */

function extractDomainFromUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return 'unknown';
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function perDomainLimit(domain: string): number {
  return DOMAIN_MAX_OVERRIDES[domain] ?? DEFAULT_PER_DOMAIN_MAX;
}

/* ========= MAIN FETCH ========= */

export async function runNewsFetchRefresh(opts?: {
  workspaceId?: string;
  userKey?: string;
  storiesTarget?: number;
  perDomainMax?: number;
  newsWindowDays?: number;
}): Promise<FetcherResult> {
  if (!supabaseAdmin) {
    throw new Error('[news/fetcher] Supabase admin client not initialized.');
  }

  const workspaceId = opts?.workspaceId || DEFAULT_WORKSPACE_ID;
  const userKey = opts?.userKey || DEFAULT_USER_KEY;
  const storiesTarget = opts?.storiesTarget ?? DEFAULT_STORIES_TARGET;
  const newsWindowDays = opts?.newsWindowDays ?? DEFAULT_NEWS_WINDOW_DAYS;

  const startedAt = nowIso();
  const errors: string[] = [];
  const domainStats: Record<string, DomainStats> = {};
  const candidates: FetcherArticleCandidate[] = [];

  for (const source of shuffle(SOURCE_REGISTRY)) {
    const query = `latest news from ${source.label} (${source.domain})`;
    let items: any[] = [];

    try {
      items = await webSearch(query, {
        news: true,
        max: perDomainLimit(source.domain) * 2,
        days: newsWindowDays,
      });
    } catch (err: any) {
      errors.push(`webSearch failed for ${source.domain}`);
      continue;
    }

    for (const item of items) {
      const url = item.url;
      if (!url) continue;

      const domain = extractDomainFromUrl(url);
      if (!domain.endsWith(source.domain)) continue;

      domainStats[domain] ??= { domain, attempted: 0, deduped: 0, inserted: 0, failed: 0 };
      domainStats[domain].attempted++;

      candidates.push({
        title: item.title || '(untitled)',
        url,
        content: item.content,
        sourceDomain: domain,
        query,
      });
    }
  }

  const seen = new Set<string>();
  const perDomainCount: Record<string, number> = {};
  const final: FetcherArticleCandidate[] = [];

  for (const c of shuffle(candidates)) {
    if (seen.has(c.url)) continue;

    const limit = perDomainLimit(c.sourceDomain);
    perDomainCount[c.sourceDomain] ??= 0;
    if (perDomainCount[c.sourceDomain] >= limit) continue;

    seen.add(c.url);
    perDomainCount[c.sourceDomain]++;
    domainStats[c.sourceDomain].deduped++;
    final.push(c);

    if (final.length >= storiesTarget) break;
  }

  let inserted = 0;
  let failed = 0;

  for (const c of final) {
    try {
      const extracted = await extractArticle({
        url: c.url,
        tavilyContent: c.content,
        tavilyTitle: c.title,
      });

      const text = (extracted.clean_text || '').trim();
      if (!extracted.success || text.length < MIN_ARTICLE_CHARS) {
        domainStats[c.sourceDomain].failed++;
        failed++;
        continue;
      }

      const row = {
        workspace_id: workspaceId,
        user_key: userKey,
        query: c.query,
        summary: text.slice(0, 1200),
        pi_score: 0.5,
        confidence_level: 'medium',
        scientific_domain: 'news',
        category: 'news_story',
        status: 'snapshot',
        raw_url: c.url,
        raw_snapshot: text.slice(0, 4000),
        created_at: nowIso(),
        updated_at: nowIso(),
      };

      const { error } = await supabaseAdmin.from('truth_facts').insert(row);
      if (error) {
        domainStats[c.sourceDomain].failed++;
        failed++;
        continue;
      }

      domainStats[c.sourceDomain].inserted++;
      inserted++;
    } catch {
      domainStats[c.sourceDomain].failed++;
      failed++;
    }
  }

  const finishedAt = nowIso();

  return {
    ok: true,
    workspaceId,
    userKey,
    startedAt,
    finishedAt,
    totalCandidates: final.length,
    totalInserted: inserted,
    totalFailed: failed,
    distinctDomains: Object.keys(domainStats).length,
    domainStats,
    errors,
  };
}

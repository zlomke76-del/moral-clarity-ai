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
/**
 * Domains listed here are intentionally slowed to avoid
 * over-representation or narrative distortion.
 */
const DOMAIN_MAX_OVERRIDES: Record<string, number> = {
  'rferl.org': 1, // Radio Free Europe / Radio Liberty
};

/* ========= STRICTNESS CONFIG ========= */

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
/**
 * Eligibility registry only.
 * No ideological weighting, no bias labeling.
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

  // U.S. opinion-leaning (eligible, not weighted)
  { id: 'newsmax', label: 'Newsmax', domain: 'newsmax.com' },
  { id: 'dailycaller', label: 'Daily Caller', domain: 'dailycaller.com' },
  { id: 'federalist', label: 'The Federalist', domain: 'thefederalist.com' },
  {
    id: 'washingtonexaminer',
    label: 'Washington Examiner',
    domain: 'washingtonexaminer.com',
  },
  { id: 'huffpost', label: 'HuffPost', domain: 'huffpost.com' },
  { id: 'guardian-us', label: 'The Guardian', domain: 'theguardian.com' },
  { id: 'atlantic', label: 'The Atlantic', domain: 'theatlantic.com' },
  { id: 'motherjones', label: 'Mother Jones', domain: 'motherjones.com' },

  // Elite finance / institutional
  { id: 'ft', label: 'Financial Times', domain: 'ft.com', country: 'UK' },
  { id: 'economist', label: 'The Economist', domain: 'economist.com', country: 'UK' },
  { id: 'barrons', label: "Barron's", domain: 'barrons.com' },

  // Legal / institutional process
  {
    id: 'courthouse',
    label: 'Courthouse News',
    domain: 'courthousenews.com',
    notes: 'Legal process reporting',
  },
  {
    id: 'lawfare',
    label: 'Lawfare',
    domain: 'lawfaremedia.org',
    notes: 'National security & legal analysis',
  },
  {
    id: 'justsecurity',
    label: 'Just Security',
    domain: 'justsecurity.org',
    notes: 'Legal & accountability analysis',
  },

  // International
  { id: 'bbc', label: 'BBC', domain: 'bbc.com', country: 'UK' },
  { id: 'aljazeera', label: 'Al Jazeera', domain: 'aljazeera.com', country: 'QA' },
  { id: 'times-uk', label: 'The Times (UK)', domain: 'thetimes.co.uk', country: 'UK' },
  { id: 'telegraph', label: 'The Telegraph', domain: 'telegraph.co.uk', country: 'UK' },
  { id: 'independent', label: 'The Independent', domain: 'independent.co.uk', country: 'UK' },
  { id: 'france24', label: 'France 24', domain: 'france24.com', country: 'FR' },
  { id: 'dw', label: 'Deutsche Welle', domain: 'dw.com', country: 'DE' },
  { id: 'spiegel', label: 'Der Spiegel', domain: 'spiegel.de', country: 'DE' },
  { id: 'lemonde', label: 'Le Monde', domain: 'lemonde.fr', country: 'FR' },
  { id: 'nikkei', label: 'Nikkei Asia', domain: 'nikkei.com', country: 'JP' },

  // State-linked international (throttled)
  {
    id: 'rfe',
    label: 'Radio Free Europe / Radio Liberty',
    domain: 'rferl.org',
    notes: 'Throttled to prevent over-sampling',
  },
];

/* ========= SMALL HELPERS ========= */

function extractDomainFromUrl(url: string): string {
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

/* ========= MAIN FETCH LOGIC ========= */

function perDomainLimit(domain: string): number {
  return DOMAIN_MAX_OVERRIDES[domain] ?? DEFAULT_PER_DOMAIN_MAX;
}

/* Remaining logic unchanged except replacing perDomainMax with perDomainLimit(domain)
   inside the dedupe / cap enforcement loop.
   (No behavioral changes elsewhere.)
*/

// ⬇️ NOTE
// The rest of the file remains identical to your current implementation,
// with the single substitution:
//   perDomainCounts[domain] >= perDomainLimit(domain)
//
// This preserves all existing behavior while enforcing RFE throttling.

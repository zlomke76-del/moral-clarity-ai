/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@supabase/supabase-js";
import { webSearch } from "@/lib/search";

/* ============================================================
   ENV / SUPABASE INIT
   ============================================================ */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[news/fetcher] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing – fetcher will throw at runtime."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

/* ============================================================
   DEFAULT CONFIG
   ============================================================ */

const DEFAULT_WORKSPACE_ID = process.env.MCA_WORKSPACE_ID || "global_news";
const DEFAULT_USER_KEY = "system-news-anchor";
const DEFAULT_STORIES_TARGET = 60;
const DEFAULT_NEWS_WINDOW_DAYS = 1;
const DEFAULT_PER_DOMAIN_MAX = 5;

/* ============================================================
   SOURCE REGISTRY (RESTORED — AUTHORITATIVE)
   ============================================================ */

type NewsSource = {
  id: string;
  label: string;
  domain: string;
};

const SOURCE_REGISTRY: NewsSource[] = [
  { id: "wsj", label: "Wall Street Journal", domain: "wsj.com" },
  { id: "nyt", label: "New York Times", domain: "nytimes.com" },
  { id: "times", label: "The Times", domain: "thetimes.co.uk" },
  { id: "reuters", label: "Reuters", domain: "reuters.com" },
  { id: "bloomberg", label: "Bloomberg", domain: "bloomberg.com" },
  { id: "ap", label: "AP News", domain: "apnews.com" },
  { id: "msnbc", label: "MSNBC", domain: "msnbc.com" },
  { id: "cnn", label: "CNN", domain: "cnn.com" },
  { id: "fox", label: "Fox News", domain: "foxnews.com" },
  { id: "bbc", label: "BBC", domain: "bbc.com" },
  { id: "newsmax", label: "Newsmax", domain: "newsmax.com" },
];

/* ============================================================
   SOURCE-SPECIFIC OVERRIDES
   ============================================================ */

type SourceOverride = {
  windowDays?: number;
  minEffective?: number;
  queryHint?: string;
};

const SOURCE_OVERRIDES: Record<string, SourceOverride> = {
  "wsj.com": {
    windowDays: 5,
    minEffective: 3,
    queryHint: "markets OR business OR economy OR analysis",
  },
  "nytimes.com": {
    windowDays: 4,
    minEffective: 3,
    queryHint: "politics OR world OR analysis",
  },
  "thetimes.co.uk": {
    windowDays: 5,
    minEffective: 2,
    queryHint: "UK politics OR economy OR world",
  },
  "msnbc.com": {
    windowDays: 3,
    minEffective: 2,
    queryHint: "politics OR investigations",
  },
  "newsmax.com": {
    windowDays: 3,
    minEffective: 1,
    queryHint: "politics OR US news",
  },
};

/* ============================================================
   DOMAIN CAPS
   ============================================================ */

const DOMAIN_MAX_OVERRIDES: Record<string, number> = {
  "foxnews.com": 2,
  "bbc.com": 2,
  "rferl.org": 1,
};

/* ============================================================
   TYPES
   ============================================================ */

export type DomainStats = {
  domain: string;
  attempted: number;
  queued: number;
  skipped: number;
};

/* ============================================================
   HELPERS
   ============================================================ */

function extractDomainFromUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "unknown";
  }
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

function sourceWindow(domain: string): number {
  return SOURCE_OVERRIDES[domain]?.windowDays ?? DEFAULT_NEWS_WINDOW_DAYS;
}

function sourceQuery(label: string, domain: string): string {
  const hint = SOURCE_OVERRIDES[domain]?.queryHint;
  return hint
    ? `latest ${hint} from ${label} (${domain})`
    : `latest news from ${label} (${domain})`;
}

/* ============================================================
   MAIN FETCH (QUEUE-ONLY)
   ============================================================ */

export async function runNewsFetchRefresh(opts?: {
  workspaceId?: string;
  userKey?: string;
  storiesTarget?: number;
}): Promise<any> {
  if (!supabaseAdmin) {
    throw new Error("[news/fetcher] Supabase admin client not initialized.");
  }

  const workspaceId = opts?.workspaceId || DEFAULT_WORKSPACE_ID;
  const userKey = opts?.userKey || DEFAULT_USER_KEY;
  const storiesTarget = opts?.storiesTarget ?? DEFAULT_STORIES_TARGET;

  const domainStats: Record<string, DomainStats> = {};
  const seen = new Set<string>();
  const queuedRows: any[] = [];

  for (const source of shuffle(SOURCE_REGISTRY)) {
    const domain = source.domain;
    const query = sourceQuery(source.label, domain);
    const windowDays = sourceWindow(domain);

    let items: any[] = [];
    try {
      items = await webSearch(query, {
        news: true,
        max: perDomainLimit(domain) * 3,
        days: windowDays,
      });
    } catch {
      continue;
    }

    domainStats[domain] ??= {
      domain,
      attempted: 0,
      queued: 0,
      skipped: 0,
    };

    for (const item of items) {
      if (queuedRows.length >= storiesTarget) break;
      if (!item?.url) continue;

      const itemDomain = extractDomainFromUrl(item.url);
      if (!itemDomain.endsWith(domain)) continue;

      domainStats[domain].attempted++;

      if (seen.has(item.url)) {
        domainStats[domain].skipped++;
        continue;
      }

      seen.add(item.url);

      queuedRows.push({
        workspace_id: workspaceId,
        user_key: userKey,
        outlet: domain,
        story_url: item.url,
        source: "tavily",
        created_at: new Date().toISOString(),
      });

      domainStats[domain].queued++;
    }
  }

  if (queuedRows.length) {
    await supabaseAdmin.from("news_backfill_queue").insert(queuedRows);
  }

  return {
    ok: true,
    totalQueued: queuedRows.length,
    distinctDomains: Object.keys(domainStats).length,
    domainStats,
  };
}

// lib/news/outlets.ts

export type OutletConfig = {
  canonical: string;     // e.g. "npr.org"
  rss?: string;          // optional RSS/Atom feed
  tavilyQuery?: string;  // optional query override for Tavily
  maxResults?: number;   // cap per outlet for backfill
};

/**
 * Central config for 90-day backfill.
 * You can grow/shrink this list without touching logic.
 */
export const OUTLET_CONFIGS: OutletConfig[] = [
  {
    canonical: "npr.org",
    rss: "https://feeds.npr.org/1001/rss.xml",
    tavilyQuery: "site:npr.org",
    maxResults: 150,
  },
  {
    canonical: "bbc.com",
    rss: "https://feeds.bbci.co.uk/news/rss.xml",
    tavilyQuery: "site:bbc.com",
    maxResults: 150,
  },
  {
    canonical: "reuters.com",
    rss: "https://www.reutersagency.com/feed/?best-topics=politics",
    tavilyQuery: "site:reuters.com",
    maxResults: 150,
  },
  {
    canonical: "foxnews.com",
    rss: "https://moxie.foxnews.com/google-publisher/latest.xml",
    tavilyQuery: "site:foxnews.com",
    maxResults: 150,
  },
  {
    canonical: "nytimes.com",
    rss: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    tavilyQuery: "site:nytimes.com",
    maxResults: 150,
  },
  // TODO: add / tune more outlets as you go
];

/**
 * Helper to look up a config by canonical outlet domain.
 */
export function getOutletConfig(canonical: string): OutletConfig | undefined {
  return OUTLET_CONFIGS.find((c) => c.canonical === canonical);
}

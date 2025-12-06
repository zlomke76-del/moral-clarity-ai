// lib/news.ts
// Unified, safe interface for the MCAI news system.
// This version uses ONLY the cached digest (Option A) and no live fetching.
// It aligns with the actual exports inside news-cache.ts and news-ledger.ts.

import { getLatestDigest } from "./news-cache";

/**
 * getNewsDigest
 * Returns the most recent cached news digest in a stable shape
 * compatible with the chat engine and context builder.
 */
export async function getNewsDigest() {
  const digest = await getLatestDigest();

  if (!digest) {
    return {
      date: null,
      stories: [],
      domainStats: {},
      errors: ["No cached digest available"],
    };
  }

  return {
    date: digest.date ?? null,
    stories: digest.stories ?? [],
    domainStats: digest.domainStats ?? {},
    errors: digest.errors ?? [],
  };
}

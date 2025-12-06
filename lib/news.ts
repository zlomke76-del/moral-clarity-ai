// lib/news.ts
// Safe façade wrapper that preserves your entire existing news pipeline

import { getCachedDigest } from "./news-cache";
import { fetchNewsAndScore } from "./fetcher";
import { getOutletLedger } from "./news-ledger";

// Unified interface consumed by the chat engine
export async function getNewsDigest() {
  // Prefer cached digest if available
  const digest = await getCachedDigest();
  if (digest) return digest;

  // Otherwise fetch fresh news (existing logic)
  const fresh = await fetchNewsAndScore();

  return fresh;
}

export { getOutletLedger };

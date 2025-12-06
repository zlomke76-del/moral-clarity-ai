// lib/news.ts
// Stable interface used by the chat engine.
// Uses the existing getCachedDigest() function as shown in repo history.

import { getCachedDigest } from "./news-cache";

/**
 * getNewsDigest()
 * Returns the most recent cached digest in a structure
 * compatible with the chat/context engine.
 */
export async function getNewsDigest() {
  const digest = await getCachedDigest();

  return {
    date: digest?.date ?? null,
    stories: digest?.stories ?? [],
    domainStats: digest?.domainStats ?? {},
    errors: digest?.errors ?? [],
  };
}

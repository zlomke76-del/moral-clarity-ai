// lib/news.ts
// Thin wrapper so the new chat modules can import cleanly.
// Does NOT rewrite or replace your News Engine.

import { getNewsDigest as existingGetNewsDigest } from "@/lib/news-engine"; 
// ⬆️ If your real digest function lives somewhere else, tell me the path and I’ll update it.

export async function getNewsDigest(userKey: string, query: string) {
  return existingGetNewsDigest(userKey, query);
}

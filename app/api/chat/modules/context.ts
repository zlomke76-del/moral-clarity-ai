// modules/context.ts

import { getMemoryPack } from "@/lib/memory";
import { getNewsDigest } from "@/lib/news";
import { runDeepResearch } from "@/lib/research";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

/**
 * Determines whether the incoming user query actually requires deep research.
 * Prevents unnecessary Tavily calls on simple conversational messages.
 */
function shouldResearch(q: string): boolean {
  if (!q) return false;

  const lower = q.toLowerCase();

  // Explicit research-related keywords
  const keywords = [
    "news",
    "latest",
    "update",
    "what happened",
    "summarize",
    "summary",
    "report",
    "current",
    "today",
    "search",
    "research",
    "trend",
    "analysis",
    "market",
    "stocks",
    "crime",
    "weather",
    "breaking",
    "headline",
    "gaza",
    "israel",
    "election",
    "poll",
  ];

  if (keywords.some((k) => lower.includes(k))) return true;

  // Long queries often imply informational intent
  if (q.length > 140) return true;

  return false;
}

/**
 * Main context builder for Solace.
 * Handles memory, news digest, and intelligent research.
 */
export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  query: string
) {
  const context: any = {
    userKey,
    workspaceId,
    persona: "Solace",
  };

  // ---- MEMORY PACK ----------------------------------------------------
  context.memoryPack = await getMemoryPack(userKey, query, {
    factsLimit: FACTS_LIMIT,
    episodesLimit: EPISODES_LIMIT,
  });

  // ---- NEWS DIGEST ----------------------------------------------------
  if (ENABLE_NEWS) {
    try {
      context.newsDigest = await getNewsDigest();
    } catch (err) {
      console.error("[context] News digest failed", err);
      context.newsDigest = null;
    }
  } else {
    context.newsDigest = null;
  }

  // ---- DEEP RESEARCH (intelligent) -----------------------------------
  if (ENABLE_RESEARCH && shouldResearch(query)) {
    try {
      context.researchContext = await runDeepResearch(query);
    } catch (err) {
      console.error("[context] Deep research failed", err);
      context.researchContext = null;
    }
  } else {
    context.researchContext = null;
  }

  return context;
}

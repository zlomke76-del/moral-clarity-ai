// modules/context.ts

import { getMemoryPack } from "@/lib/memory";
import { getNewsDigest } from "@/lib/news";
import { runDeepResearch } from "@/lib/research";
import { FACTS_LIMIT, EPISODES_LIMIT, ENABLE_NEWS, ENABLE_RESEARCH } from "./constants";

export async function assembleContext(userKey: string, workspaceId: string | null, query: string) {
  const context: any = {
    userKey,
    workspaceId,
    persona: "Solace",
  };

  // Memory Pack
  context.memoryPack = await getMemoryPack(userKey, query, {
    factsLimit: FACTS_LIMIT,
    episodesLimit: EPISODES_LIMIT,
  });

  // News (if allowed)
  if (ENABLE_NEWS) {
    context.newsDigest = await getNewsDigest();
  }

  // Deep research (if allowed)
  if (ENABLE_RESEARCH) {
    context.researchContext = await runDeepResearch(query);
  }

  return context;
}

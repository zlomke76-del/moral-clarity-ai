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

export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  query: string
) {
  const context: any = {
    persona: "Solace",
    userKey,
    workspaceId,
  };

  // Memory Pack
  context.memoryPack = await getMemoryPack(userKey, query, {
    factsLimit: FACTS_LIMIT,
    episodesLimit: EPISODES_LIMIT,
  });

  // Optional News
  context.newsDigest = ENABLE_NEWS ? await getNewsDigest() : null;

  // Optional Research
  context.researchContext = ENABLE_RESEARCH
    ? await runDeepResearch(query)
    : null;

  return context;
}

// lib/memory-intelligence.ts
// Deterministic memory engine powering consolidation, recall, scoring, and pack-building.

import { createClient } from "@supabase/supabase-js";
import { classifyMemory } from "./ethics/classifier";
import { evaluateMemoryLifecycle } from "./ethics/lifecycle";
import { detectDrift } from "./ethics/drift";
import { ethicalOversight } from "./ethics/oversight-engine";
import { rankMemories } from "./ethics/retrieval";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/* ---------------------------------------------------------
   1. BASIC MEMORY SCORING
--------------------------------------------------------- */

export function scoreMemory(content: string): number {
  let score = 1;

  if (/i am|my name|i live|i work/i.test(content)) score += 3;
  if (/i believe|i value|my principle/i.test(content)) score += 2;
  if (/i realized|i learned/i.test(content)) score += 2;

  return score;
}

/* ---------------------------------------------------------
   2. SEARCH INDEX (deterministic, non-vector)
--------------------------------------------------------- */

export async function searchMemoryIndex(user_key: string, query: string) {
  const { data, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key);

  if (error || !data) return [];

  const q = query.toLowerCase();

  return data.filter(m =>
    (m.title || "").toLowerCase().includes(q) ||
    (m.content || "").toLowerCase().includes(q)
  );
}

/* ---------------------------------------------------------
   3. CONSOLIDATION ENGINE
--------------------------------------------------------- */

export async function consolidateMemory(user_key: string, newContent: string) {
  const { data: rows } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!rows || rows.length === 0) return null;

  for (const existing of rows) {
    const drift = detectDrift(newContent, existing.content);

    // If conflict is too high → do not merge
    if (drift.driftDetected && drift.conflictLevel >= 2) continue;

    // If they are nearly identical, merge
    if (existing.content.toLowerCase().trim() === newContent.toLowerCase().trim()) {
      return { mergedInto: existing.id };
    }

    // If existing contains majority of new content → update existing
    if (existing.content.includes(newContent.slice(0, 20))) {
      await supabase
        .from("user_memories")
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      return { mergedInto: existing.id };
    }
  }

  return null;
}

/* ---------------------------------------------------------
   4. INSIGHT DETECTION
--------------------------------------------------------- */

export function detectInsight(content: string): boolean {
  return /(i realized|i learned|i understood|it occurred to me|breakthrough)/i.test(
    content.toLowerCase()
  );
}

/* ---------------------------------------------------------
   5. STORE EPISODE
--------------------------------------------------------- */

export async function storeEpisode(
  user_key: string,
  content: string,
  workspace_id?: string | null
) {
  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      content,
      title: "Episode",
      kind: "episode",
      workspace_id,
      importance: 1,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* ---------------------------------------------------------
   6. BUILD MEMORY PACK (FACTS + IDENTITY + VALUES + INSIGHTS + EPISODES)
--------------------------------------------------------- */

export async function buildMemoryPack(
  user_key: string,
  query: string | null,
  opts: { factsLimit: number; episodesLimit: number }
) {
  const { data: rows, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !rows) return { facts: [], identity: [], values: [], insights: [], episodes: [] };

  const ranked = rankMemories(rows);

  const facts = ranked.filter(r => r.kind === "fact").slice(0, opts.factsLimit);
  const identity = ranked.filter(r => r.kind === "identity").slice(0, 10);
  const values = ranked.filter(r => r.kind === "value").slice(0, 10);
  const insights = ranked.filter(r => r.kind === "insight").slice(0, 20);
  const episodes = ranked.filter(r => r.kind === "episode").slice(0, opts.episodesLimit);

  // If query present → include matches
  let queryMatches: any[] = [];
  if (query) {
    const q = query.toLowerCase();
    queryMatches = ranked.filter(
      m =>
        (m.content || "").toLowerCase().includes(q) ||
        (m.title || "").toLowerCase().includes(q)
    );
  }

  return {
    facts,
    identity,
    values,
    insights,
    episodes,
    queryMatches,
  };
}

/* ---------------------------------------------------------
   7. MEMORY DECISION ENGINE
   (classification → lifecycle → oversight)
--------------------------------------------------------- */

export function evaluateNewMemory(content: string) {
  const classification = classifyMemory(content);
  const lifecycle = evaluateMemoryLifecycle(content);
  const oversight = ethicalOversight(classification, lifecycle);

  return {
    classification,
    lifecycle,
    oversight,
  };
}

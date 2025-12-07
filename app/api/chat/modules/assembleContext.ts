// app/api/chat/modules/assembleContext.ts
// -----------------------------------------------------------------------------
// Solace Context Loader — canonical identity + unified memory model
// Reads from mv_unified_memory, episodic tables, and digest tables.
// No personas table — persona comes from /lib/solace/persona.ts
// -----------------------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

const UNIFIED_LIMIT = 50;
const EPISODES_LIMIT = 8;
const NEWS_LIMIT = 15;
const RESEARCH_LIMIT = 10;

// -----------------------------------------------------------------------------
// UTILITIES
// -----------------------------------------------------------------------------
function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

function needsEpisodic(message: string): boolean {
  return [
    "remember when",
    "last time",
    "episode",
    "story",
    "continue",
    "earlier",
    "thread",
  ].some((k) => message.toLowerCase().includes(k));
}

function needsAutobio(message: string): boolean {
  return [
    "my past",
    "childhood",
    "autobiography",
    "life story",
    "who am i",
    "identity",
    "journey",
  ].some((k) => message.toLowerCase().includes(k));
}

// -----------------------------------------------------------------------------
// PERSONA — from /lib/solace/persona.ts (not Supabase!)
// -----------------------------------------------------------------------------
async function loadPersona(): Promise<string> {
  return "Solace";
}

// -----------------------------------------------------------------------------
// UNIFIED MEMORY LOAD  (mv_unified_memory)
// -----------------------------------------------------------------------------
async function loadUnifiedMemory(canonicalKey: string) {
  const { data, error } = await supabaseEdge
    .from("mv_unified_memory")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("created_at", { ascending: false })
    .limit(UNIFIED_LIMIT);

  if (error) {
    console.error("[assembleContext] unified memory error:", error);
    return [];
  }

  return safe(data);
}

// -----------------------------------------------------------------------------
// EPISODIC MEMORY
// -----------------------------------------------------------------------------
async function loadEpisodic(canonicalKey: string, enable: boolean) {
  if (!enable) return [];

  const { data: episodes } = await supabaseEdge
    .from("memory_episodes")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  const epList = safe(episodes);
  if (epList.length === 0) return [];

  const { data: chunks } = await supabaseEdge
    .from("memory_episode_chunks")
    .select("*")
    .in(
      "episode_id",
      epList.map((e) => e.id)
    )
    .order("seq", { ascending: true });

  const chunkList = safe(chunks);

  return epList.map((ep) => ({
    ...ep,
    chunks: chunkList.filter((c) => c.episode_id === ep.id),
  }));
}

// -----------------------------------------------------------------------------
// AUTOBIO
// -----------------------------------------------------------------------------
async function loadAutobiography(canonicalKey: string, enable: boolean) {
  if (!enable) return { chapters: [], entries: [] };

  const { data: chapters } = await supabaseEdge
    .from("user_autobio_chapters")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("start_year");

  const { data: entries } = await supabaseEdge
    .from("user_autobiography")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("year");

  return {
    chapters: safe(chapters),
    entries: safe(entries),
  };
}

// -----------------------------------------------------------------------------
// NEWS DIGEST
// -----------------------------------------------------------------------------
async function loadNewsDigest(canonicalKey: string) {
  const { data } = await supabaseEdge
    .from("vw_solace_news_digest")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("scored_at", { ascending: false })
    .limit(NEWS_LIMIT);

  return safe(data);
}

// -----------------------------------------------------------------------------
// RESEARCH
// -----------------------------------------------------------------------------
async function loadResearch(canonicalKey: string) {
  const { data } = await supabaseEdge
    .from("truth_facts")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("created_at", { ascending: false })
    .limit(RESEARCH_LIMIT);

  return safe(data);
}

// -----------------------------------------------------------------------------
// MAIN EXPORT
// -----------------------------------------------------------------------------
export async function assembleContext(
  incomingUserKey: string,
  workspaceId: string | null,
  userMessage: string,
  req?: Request
) {
  // 1) Determine canonical identity (email)
  const { canonicalKey } = await getCanonicalUserKey(req);

  // 2) Conditional loads
  const episodicNeeded = needsEpisodic(userMessage);
  const autobioNeeded = needsAutobio(userMessage);

  console.log("[Solace Context] Load decisions:", {
    canonicalKey,
    episodicNeeded,
    autobioNeeded,
    workspaceId,
  });

  // 3) Load memory domains
  const persona = await loadPersona();
  const unified = await loadUnifiedMemory(canonicalKey);
  const episodic = await loadEpisodic(canonicalKey, episodicNeeded);
  const autobio = await loadAutobiography(canonicalKey, autobioNeeded);

  const newsDigest = await loadNewsDigest(canonicalKey);
  const researchContext = await loadResearch(canonicalKey);

  return {
    persona,
    memoryPack: {
      unified,
      episodic,
      autobio,
    },
    newsDigest,
    researchContext,
  };
}

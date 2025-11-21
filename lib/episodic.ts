// lib/episodic.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dims
const EPISODE_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const sb = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

async function embed(text: string): Promise<number[]> {
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });
  const j = await r.json();
  return j?.data?.[0]?.embedding ?? [];
}

export type EpisodicInsert = {
  user_key: string;
  workspace_id: string | null;
  episode_summary: string;
  emotional_state: string | null;
  motivational_drivers: string | null;
  dominant_topics: string[];
  open_loops: string[];
  decision_points: string[];
  resolution_status: string | null;
  episodic_type: string;
};

export async function summarizeEpisode(messages: { role: string; content: string }[]): Promise<EpisodicInsert> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  // Extract only user + assistant text for summarization
  const conv = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  const prompt = `
You are Solace’s episodic memory engine.

Your job: Convert a stretch of conversation into a rich episodic summary (10–20 sentences).  
This summary must capture:
- emotional tone of the user  
- the strategic or narrative arc  
- key decisions made or debated  
- shifts in thinking or worldview  
- conflicts, tensions, and resolutions  
- open loops or unresolved questions  
- moral/ethical dimensions  
- major contextual anchors (but no raw quotes)

Then extract structured metadata:
- emotional_state
- motivational_drivers
- dominant_topics (3–7 keywords)
- open_loops (0–5 items)
- decision_points (0–5 items)
- resolution_status (brief)
- episodic_type (Decision, Emotional, Strategic, Technical, Relational)

RETURN STRICT JSON:

{
  "summary": "...",
  "emotional_state": "...",
  "motivational_drivers": "...",
  "dominant_topics": ["..."],
  "open_loops": ["..."],
  "decision_points": ["..."],
  "resolution_status": "...",
  "episodic_type": "..."
}

CONVERSATION:
${conv}
`;

  const resp = await client.responses.create({
    model: EPISODE_MODEL,
    input: prompt,
    max_output_tokens: 800,
    temperature: 0.2,
  });

  const raw = (resp as any).output_text ?? "";
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error("Episodic parsing failed: " + raw);
  }

  return {
    user_key: "",
    workspace_id: null,
    episode_summary: parsed.summary ?? "",
    emotional_state: parsed.emotional_state ?? null,
    motivational_drivers: parsed.motivational_drivers ?? null,
    dominant_topics: parsed.dominant_topics ?? [],
    open_loops: parsed.open_loops ?? [],
    decision_points: parsed.decision_points ?? [],
    resolution_status: parsed.resolution_status ?? null,
    episodic_type: parsed.episodic_type ?? "Episodic",
  };
}

export async function storeEpisode(
  user_key: string,
  workspace_id: string | null,
  ep: EpisodicInsert
) {
  const client = sb();
  const vec = await embed(ep.episode_summary);

  const { error } = await client.from("episodic_memories").insert([
    {
      user_key,
      workspace_id,
      episode_summary: ep.episode_summary,
      emotional_state: ep.emotional_state,
      motivational_drivers: ep.motivational_drivers,
      dominant_topics: ep.dominant_topics,
      open_loops: ep.open_loops,
      decision_points: ep.decision_points,
      resolution_status: ep.resolution_status,
      episodic_type: ep.episodic_type,
      embedding: vec,
    },
  ]);

  if (error) throw error;
}

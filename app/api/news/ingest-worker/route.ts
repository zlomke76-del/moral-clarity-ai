// app/api/news/ingest-worker/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ============================================================
   ENV
   ============================================================ */

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY!;
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE env missing");
}
if (!TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY missing – ingest must not run without Tavily");
}

/* ============================================================
   SUPABASE (ADMIN)
   ============================================================ */

const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

/* ============================================================
   TYPES
   ============================================================ */

type BackfillQueueRow = {
  id: string;
  story_url: string | null;
  outlet: string | null;
  discovered_at: string | null;
};

/* ============================================================
   HELPERS
   ============================================================ */

function clamp(text: string, max = 20000) {
  return text.length <= max ? text : text.slice(0, max) + "\n[truncated]";
}

function stripHtml(html: string) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ============================================================
   TAVILY — AUTHORITATIVE SOURCE
   ============================================================ */

async function fetchViaTavily(url: string): Promise<string | null> {
  const r = await fetch("https://api.tavily.com/extract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      urls: [url],
      include_raw_content: true,
    }),
  });

  if (!r.ok) return null;

  const json = await r.json();
  const content = json?.results?.[0]?.raw_content;
  if (!content) return null;

  return clamp(stripHtml(content));
}

/* ============================================================
   BROWSERLESS — FALLBACK ONLY
   ============================================================ */

async function fetchViaBrowserless(url: string): Promise<string | null> {
  if (!BROWSERLESS_TOKEN) return null;

  try {
    const r = await fetch(
      `https://chrome.browserless.io/content?token=${encodeURIComponent(
        BROWSERLESS_TOKEN
      )}&url=${encodeURIComponent(url)}`
    );
    if (!r.ok) return null;

    const text = await r.text();
    return clamp(stripHtml(text));
  } catch {
    return null;
  }
}

/* ============================================================
   QUEUE FETCH
   ============================================================ */

async function fetchQueue(limit: number): Promise<BackfillQueueRow[]> {
  const { data, error } = await supabaseAdmin
    .from("news_backfill_queue")
    .select("*")
    .order("discovered_at", { ascending: true })
    .limit(limit);

  if (error) return [];
  return (data || []) as BackfillQueueRow[];
}

/* ============================================================
   INGEST SINGLE ROW
   ============================================================ */

async function ingestRow(
  row: BackfillQueueRow,
  stats: any
): Promise<boolean> {
  if (!row.story_url) return false;

  stats.tavily_attempted++;

  // 1. TAVILY (REQUIRED)
  let body = await fetchViaTavily(row.story_url);
  if (body) {
    stats.tavily_succeeded++;
  } else {
    // 2. BROWSERLESS (FALLBACK ONLY)
    stats.browserless_fallback_attempted++;
    body = await fetchViaBrowserless(row.story_url);
    if (body) stats.browserless_fallback_succeeded++;
  }

  // If still nothing → HARD FAIL
  if (!body) {
    stats.failed++;
    return false;
  }

  const now = new Date().toISOString();

  const { error } = await supabaseAdmin.from("truth_facts").insert({
    workspace_id: "global_news",
    user_key: "system-news-anchor",
    scientific_domain: "news",
    category: "news_story",
    status: "ingested",
    raw_url: row.story_url,
    raw_snapshot: body,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    stats.failed++;
    return false;
  }

  await supabaseAdmin
    .from("news_backfill_queue")
    .delete()
    .eq("id", row.id);

  stats.ingested++;
  return true;
}

/* ============================================================
   HANDLER
   ============================================================ */

export async function GET(req: NextRequest) {
  const limit = Math.min(
    20,
    Math.max(1, Number(new URL(req.url).searchParams.get("limit") || 10))
  );

  const startedAt = new Date().toISOString();

  const stats = {
    tavily_attempted: 0,
    tavily_succeeded: 0,
    browserless_fallback_attempted: 0,
    browserless_fallback_succeeded: 0,
    ingested: 0,
    failed: 0,
  };

  const rows = await fetchQueue(limit);

  for (const row of rows) {
    await ingestRow(row, stats);
  }

  return NextResponse.json({
    ok: true,
    startedAt,
    finishedAt: new Date().toISOString(),
    limit,
    totalCandidates: rows.length,
    ...stats,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

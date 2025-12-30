export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ========= ENV ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN || "";

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

/* ========= HELPERS ========= */

function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(text: string, max = 20000): string {
  return text.length <= max ? text : text.slice(0, max);
}

/* ========= FETCH METHODS ========= */

async function fetchViaTavily(url: string): Promise<string | null> {
  if (!TAVILY_API_KEY) return null;

  try {
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

    return clampText(stripHtml(content));
  } catch {
    return null;
  }
}

async function fetchViaBrowserless(url: string): Promise<string | null> {
  if (!BROWSERLESS_TOKEN) return null;

  try {
    const r = await fetch("https://chrome.browserless.io/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BROWSERLESS_TOKEN}`,
      },
      body: JSON.stringify({ url, waitFor: 2000 }),
    });

    if (!r.ok) return null;
    return clampText(stripHtml(await r.text()));
  } catch {
    return null;
  }
}

async function fetchDirect(url: string): Promise<string | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return clampText(stripHtml(await r.text()));
  } catch {
    return null;
  }
}

/* ========= INGEST ========= */

async function ingest(row: any, stats: any): Promise<boolean> {
  if (!row.story_url || !supabaseAdmin) return false;

  let body: string | null = null;

  stats.tavily_attempted++;
  body = await fetchViaTavily(row.story_url);
  if (body) stats.tavily_succeeded++;

  if (!body) {
    stats.browserless_attempted++;
    body = await fetchViaBrowserless(row.story_url);
    if (body) stats.browserless_succeeded++;
  }

  if (!body) {
    stats.direct_attempted++;
    body = await fetchDirect(row.story_url);
    if (body) stats.direct_succeeded++;
  }

  if (!body) {
    stats.failed++;
    return false;
  }

  const now = new Date().toISOString();

  await supabaseAdmin.from("truth_facts").insert({
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

  await supabaseAdmin.from("news_backfill_queue").delete().eq("id", row.id);
  stats.ingested++;
  return true;
}

/* ========= HANDLER ========= */

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "Supabase not initialized" });
  }

  const { data: rows } = await supabaseAdmin
    .from("news_backfill_queue")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(10);

  const stats = {
    tavily_attempted: 0,
    tavily_succeeded: 0,
    browserless_attempted: 0,
    browserless_succeeded: 0,
    direct_attempted: 0,
    direct_succeeded: 0,
    ingested: 0,
    failed: 0,
  };

  for (const row of rows || []) {
    await ingest(row, stats);
  }

  return NextResponse.json({
    ok: true,
    limit: rows?.length ?? 0,
    ...stats,
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}

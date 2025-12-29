// app/api/news/ingest-worker/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ========= ENV / SUPABASE INIT ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[news/ingest-worker] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing – route will 500 at runtime."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

/* ========= TYPES ========= */

type BackfillQueueRow = {
  id: string;
  outlet: string | null;
  story_url: string | null;
  source: "rss" | "tavily" | string | null;
  discovered_at: string | null;
};

/* ========= HELPERS ========= */

function jsonError(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

function outletFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
}

function clampText(text: string | null | undefined, max = 20000): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max) + "\n[...truncated for ingest...]";
}

function stripHtml(html: string): string {
  const withoutScripts = html.replace(
    /<(script|style)[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );
  const withoutTags = withoutScripts.replace(/<[^>]+>/g, " ");
  return withoutTags.replace(/\s+/g, " ").trim();
}

async function fetchArticleSnapshot(url: string): Promise<string | null> {
  if (!url) return null;

  try {
    if (BROWSERLESS_TOKEN) {
      const browserlessUrl = `https://chrome.browserless.io/content?token=${encodeURIComponent(
        BROWSERLESS_TOKEN
      )}&url=${encodeURIComponent(url)}`;

      const r = await fetch(browserlessUrl);
      if (r.ok) {
        const text = await r.text();
        return clampText(
          text.startsWith("<") ? stripHtml(text) : text,
          20000
        );
      }
    }

    const r2 = await fetch(url);
    if (!r2.ok) return null;
    return clampText(stripHtml(await r2.text()), 20000);
  } catch {
    return null;
  }
}

/* ========= QUEUE FETCH ========= */

async function fetchQueueBatch(limit: number): Promise<BackfillQueueRow[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("news_backfill_queue")
    .select("*")
    .order("discovered_at", { ascending: true })
    .limit(limit * 3);

  if (error) {
    console.error("[news/ingest-worker] Failed to fetch queue rows", error);
    return [];
  }

  const queueRows = (data || []) as BackfillQueueRow[];
  const result: BackfillQueueRow[] = [];

  for (const row of queueRows) {
    if (!row.story_url) continue;

    const { data: existing, error: existErr } = await supabaseAdmin
      .from("truth_facts")
      .select("id")
      .eq("scientific_domain", "news")
      .eq("category", "news_story")
      .eq("raw_url", row.story_url)
      .maybeSingle();

    if (existErr && existErr.code !== "PGRST116") continue;
    if (existing) continue;

    result.push(row);
    if (result.length >= limit) break;
  }

  return result;
}

/* ========= INGEST ========= */

async function ingestQueueRow(row: BackfillQueueRow): Promise<boolean> {
  if (!supabaseAdmin || !row.story_url) return false;

  const body = await fetchArticleSnapshot(row.story_url);
  if (!body) return false;

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

  if (error) return false;

  await supabaseAdmin.from("news_backfill_queue").delete().eq("id", row.id);
  return true;
}

/* ========= HANDLERS ========= */

export async function GET(req: NextRequest) {
  const limit = Math.min(
    20,
    Math.max(1, Number(new URL(req.url).searchParams.get("limit") || 10))
  );

  const startedAt = new Date().toISOString();
  const rows = await fetchQueueBatch(limit);

  let ingested = 0;
  for (const row of rows) {
    if (await ingestQueueRow(row)) ingested++;
  }

  return NextResponse.json({
    ok: true,
    startedAt,
    finishedAt: new Date().toISOString(),
    limit,
    totalCandidates: rows.length,
    ingested,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

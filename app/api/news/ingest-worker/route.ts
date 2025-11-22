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
  created_at: string | null;
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

/**
 * Very simple HTML -> text stripper.
 * This does NOT try to be a full readability parser — your scoring
 * worker just needs a decent snapshot body.
 */
function stripHtml(html: string): string {
  // Remove script/style
  const withoutScripts = html.replace(
    /<(script|style)[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );
  // Strip tags
  const withoutTags = withoutScripts.replace(/<[^>]+>/g, " ");
  // Collapse whitespace
  return withoutTags.replace(/\s+/g, " ").trim();
}

/**
 * Fetch article content using Browserless if configured, otherwise
 * fall back to a direct fetch of the page HTML.
 */
async function fetchArticleSnapshot(url: string): Promise<string | null> {
  if (!url) return null;

  try {
    // Prefer Browserless content extraction if token is available
    if (BROWSERLESS_TOKEN) {
      const browserlessUrl = `https://chrome.browserless.io/content?token=${encodeURIComponent(
        BROWSERLESS_TOKEN
      )}&url=${encodeURIComponent(url)}`;

      const r = await fetch(browserlessUrl, {
        method: "GET",
      });

      if (!r.ok) {
        console.warn("[news/ingest-worker] Browserless fetch failed", {
          url,
          status: r.status,
        });
      } else {
        const text = await r.text();
        // Browserless /content often returns cleaned text already;
        // If it's HTML-ish, strip tags; otherwise, use as-is.
        const maybeText = text.trim();
        if (maybeText.startsWith("<!DOCTYPE") || maybeText.startsWith("<html")) {
          return clampText(stripHtml(maybeText), 20000);
        }
        return clampText(maybeText, 20000);
      }
    }

    // Fallback: direct fetch of page HTML
    const r2 = await fetch(url, { method: "GET" });
    if (!r2.ok) {
      console.warn("[news/ingest-worker] direct fetch failed", {
        url,
        status: r2.status,
      });
      return null;
    }
    const html = await r2.text();
    const body = stripHtml(html);
    return clampText(body, 20000);
  } catch (err) {
    console.warn("[news/ingest-worker] fetchArticleSnapshot error", {
      url,
      err,
    });
    return null;
  }
}

/**
 * Fetch a batch of backfill queue rows that have NOT yet produced
 * a truth_fact with matching raw_url.
 */
async function fetchQueueBatch(limit: number): Promise<BackfillQueueRow[]> {
  if (!supabaseAdmin) return [];

  // Grab more than we need, since we'll skip ones that already have truth_facts.
  const { data, error } = await supabaseAdmin
    .from("news_backfill_queue")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limit * 3);

  if (error) {
    console.error("[news/ingest-worker] Failed to fetch queue rows", error);
    return [];
  }

  const queueRows = (data || []) as BackfillQueueRow[];
  const result: BackfillQueueRow[] = [];

  for (const row of queueRows) {
    if (!row.story_url) continue;

    // Check if a truth_fact already exists for this URL
    const { data: existing, error: existErr } = await supabaseAdmin
      .from("truth_facts")
      .select("id")
      .eq("scientific_domain", "news")
      .eq("category", "news_story")
      .eq("raw_url", row.story_url)
      .maybeSingle();

    // PGRST116 is "No rows found" – treat as not existing.
    if (existErr && existErr.code !== "PGRST116") {
      console.error(
        "[news/ingest-worker] truth_facts existence check error",
        existErr
      );
      continue;
    }

    if (existing && (existing as any).id) {
      // Already ingested, skip
      continue;
    }

    result.push(row);
    if (result.length >= limit) break;
  }

  return result;
}

/**
 * Ingest a single queue row into truth_facts by:
 *  - fetching the article snapshot
 *  - inserting a standardized truth_fact record
 *  - deleting the queue row on success
 */
async function ingestQueueRow(row: BackfillQueueRow): Promise<boolean> {
  if (!supabaseAdmin) return false;
  if (!row.story_url) return false;

  const url = row.story_url;
  const outlet = row.outlet || outletFromUrl(url);
  const body = await fetchArticleSnapshot(url);

  if (!body || !body.trim()) {
    console.warn("[news/ingest-worker] empty snapshot body for", url);
    return false;
  }

  const nowIso = new Date().toISOString();

  const truthFactRow: Record<string, any> = {
    workspace_id: "global_news",
    user_key: "system-news-anchor",
    user_id: null,

    query: url, // or null; this is just a convenience field here.
    summary: null, // scoring worker can derive from raw_snapshot if needed.
    scientific_domain: "news",
    category: "news_story",

    status: "ingested",
    sources: {
      outlet,
      source: row.source || "rss",
      backfill: true,
    },

    raw_url: url,
    raw_snapshot: body,
    created_at: nowIso,
    updated_at: nowIso,
  };

  const { error: insertErr } = await supabaseAdmin
    .from("truth_facts")
    .insert(truthFactRow);

  if (insertErr) {
    console.error("[news/ingest-worker] truth_facts insert error", {
      queue_id: row.id,
      url,
      message: insertErr.message,
      code: insertErr.code,
    });
    return false;
  }

  // Best-effort: delete queue row now that it's ingested
  const { error: deleteErr } = await supabaseAdmin
    .from("news_backfill_queue")
    .delete()
    .eq("id", row.id);

  if (deleteErr) {
    console.warn("[news/ingest-worker] Failed to delete backfill queue row", {
      id: row.id,
      url,
      message: deleteErr.message,
      code: deleteErr.code,
    });
    // Not fatal; we just risk trying to ingest again later, but truth_facts raw_url uniqueness should prevent duplicates if you add it.
  }

  return true;
}

async function ingestBatch(limit: number) {
  if (!supabaseAdmin) {
    throw new Error(
      "[news/ingest-worker] Supabase admin client not initialized – missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const toIngest = await fetchQueueBatch(limit);
  if (!toIngest.length) {
    return {
      totalCandidates: 0,
      ingested: 0,
      errors: [] as string[],
      details: [] as any[],
    };
  }

  let ingested = 0;
  const errors: string[] = [];
  const details: any[] = [];

  for (const row of toIngest) {
    try {
      const ok = await ingestQueueRow(row);
      if (!ok) {
        errors.push(`Failed to ingest queue_id=${row.id} url=${row.story_url}`);
        continue;
      }

      ingested++;
      details.push({
        queue_id: row.id,
        outlet: row.outlet,
        story_url: row.story_url,
        source: row.source,
      });
    } catch (err: any) {
      console.error(
        "[news/ingest-worker] Fatal ingest error for queue_id",
        row.id,
        err
      );
      errors.push(
        `Fatal ingest error for queue_id=${row.id}: ${
          err?.message || String(err)
        }`
      );
    }
  }

  return {
    totalCandidates: toIngest.length,
    ingested,
    errors,
    details,
  };
}

/* ========= HANDLERS ========= */

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError(
        "Supabase admin client not configured on server (missing env).",
        500,
        { code: "NO_SUPABASE_ADMIN" }
      );
    }

    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam
      ? Math.max(1, Math.min(Number(limitParam) || 0, 20))
      : 10;

    const startedAt = new Date().toISOString();
    const result = await ingestBatch(limit);
    const finishedAt = new Date().toISOString();

    return NextResponse.json({
      ok: true,
      startedAt,
      finishedAt,
      limit,
      ...result,
    });
  } catch (err: any) {
    console.error("[news/ingest-worker] fatal error", err);
    return jsonError(err?.message || "Unexpected error in news ingest worker.", 500, {
      code: "NEWS_INGEST_FATAL",
    });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

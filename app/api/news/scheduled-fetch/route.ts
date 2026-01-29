// app/api/news/scheduled-fetch/route.ts
// ============================================================
// SCHEDULED NEWS FETCH (QUEUE-ONLY)
// Canonical, coverage-enforced population of news_backfill_queue
// ============================================================
// This route:
//  - enumerates ALL approved outlets
//  - attempts discovery per outlet (RSS-first)
//  - enforces full coverage BEFORE queue insertion
//  - inserts ONLY into news_backfill_queue
//  - performs no ingestion, scoring, or ledger work
// ============================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { OUTLET_CONFIGS } from "@/lib/news/outlets";
import { fetchRssItems, filterItemsByDays } from "@/lib/news/rss";

/* ========= ENV ========= */

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const NEWS_REFRESH_SECRET = process.env.NEWS_REFRESH_SECRET || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase service credentials");
}

const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

/* ========= TYPES ========= */

type FetchedStory = {
  url: string;
  source: "rss" | "tavily";
};

type CoverageReport = {
  attempted: string[];
  succeeded: string[];
  noContent: string[];
  failed: { outlet: string; reason: string }[];
};

/* ========= HELPERS ========= */

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.toString();
  } catch {
    return url;
  }
}

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/* ========= COVERAGE-ENFORCED FETCH ========= */

async function fetchApprovedSources(): Promise<{
  stories: FetchedStory[];
  coverage: CoverageReport;
}> {
  const stories: FetchedStory[] = [];

  const coverage: CoverageReport = {
    attempted: [],
    succeeded: [],
    noContent: [],
    failed: [],
  };

  for (const outlet of OUTLET_CONFIGS) {
    const canonical = outlet.canonical;
    coverage.attempted.push(canonical);

    if (!outlet.rss) {
      // RSS missing is a legitimate configuration choice
      coverage.noContent.push(canonical);
      continue;
    }

    try {
      const items = await fetchRssItems(outlet.rss);
      const recent = filterItemsByDays(items, 2);

      if (!recent.length) {
        coverage.noContent.push(canonical);
        continue;
      }

      for (const item of recent.slice(0, outlet.maxResults ?? 20)) {
        stories.push({
          url: normalizeUrl(item.link),
          source: "rss",
        });
      }

      coverage.succeeded.push(canonical);
    } catch (err: any) {
      coverage.failed.push({
        outlet: canonical,
        reason: err?.message || String(err),
      });
    }
  }

  return { stories, coverage };
}

/* ========= MAIN ========= */

export async function POST(req: NextRequest) {
  if (NEWS_REFRESH_SECRET) {
    const token =
      new URL(req.url).searchParams.get("secret") ||
      req.headers.get("x-news-secret");

    if (token !== NEWS_REFRESH_SECRET) {
      return jsonError("Unauthorized", 401);
    }
  }

  const startedAt = new Date().toISOString();

  let result;
  try {
    result = await fetchApprovedSources();
  } catch (err: any) {
    console.error("[news/scheduled-fetch] fetch failed", err);
    return jsonError("Fetch failure");
  }

  const { stories, coverage } = result;

  if (coverage.failed.length > 0) {
    console.error("[news/scheduled-fetch] coverage incomplete", coverage);

    return NextResponse.json(
      {
        ok: false,
        status: "coverage_incomplete",
        coverage,
      },
      { status: 503 }
    );
  }

  if (!stories.length) {
    return NextResponse.json({
      ok: true,
      startedAt,
      inserted: 0,
      skipped: 0,
      message: "No approved stories fetched (full coverage, no content)",
      coverage,
    });
  }

  let inserted = 0;
  let skipped = 0;

  for (const item of stories) {
    const url = item.url;

    const { data: exists } = await supabaseAdmin
      .from("news_backfill_queue")
      .select("id")
      .eq("story_url", url)
      .maybeSingle();

    if (exists) {
      skipped++;
      continue;
    }

    const { error } = await supabaseAdmin
      .from("news_backfill_queue")
      .insert({
        outlet: (() => {
          try {
            return new URL(url).hostname.replace(/^www\./, "");
          } catch {
            return null;
          }
        })(),
        story_url: url,
        source: item.source,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("[news/scheduled-fetch] insert failed", {
        url,
        error: error.message,
      });
      skipped++;
      continue;
    }

    inserted++;
  }

  return NextResponse.json({
    ok: true,
    startedAt,
    finishedAt: new Date().toISOString(),
    fetched: stories.length,
    inserted,
    skipped,
    coverage,
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}

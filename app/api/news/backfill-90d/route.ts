// app/api/news/backfill-90d/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { OUTLET_CONFIGS, getOutletConfig } from "@/lib/news/outlets";
import { fetchRssItems, filterItemsByDays } from "@/lib/news/rss";
import { webSearch } from "@/lib/search";

/* ========= ENV / ADMIN CLIENT ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[news/backfill-90d] Missing Supabase admin credentials — API will 500."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

function jsonError(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/* ========= Helpers ========= */

async function enqueueStory(
  outlet: string,
  url: string,
  source: "rss" | "tavily"
) {
  if (!supabaseAdmin) return;

  const { error } = await supabaseAdmin
    .from("news_backfill_queue")
    .insert({
      outlet,
      story_url: url,
      source,
    })
    .select("id")
    .single();

  // Ignore unique violations; they just mean it's already queued.
  if (error && error.code !== "23505") {
    console.warn("[news/backfill-90d] enqueue error", { outlet, url, error });
  }
}

async function backfillOutlet(canonical: string, days: number) {
  const cfg = getOutletConfig(canonical);
  if (!cfg) {
    console.warn("[news/backfill-90d] no config for outlet", canonical);
    return { outlet: canonical, rssQueued: 0, tavilyQueued: 0 };
  }

  let rssQueued = 0;
  let tavilyQueued = 0;

  // ----- 1) RSS pass (free) -----
  if (cfg.rss) {
    try {
      const rawItems = await fetchRssItems(cfg.rss);
      const items = filterItemsByDays(rawItems, days);
      for (const item of items) {
        await enqueueStory(cfg.canonical, item.link, "rss");
        rssQueued++;
      }
    } catch (err) {
      console.warn("[news/backfill-90d] RSS error", cfg.canonical, err);
    }
  }

  // ----- 2) Tavily pass (cheap) -----
  try {
    const query = cfg.tavilyQuery ?? `site:${cfg.canonical}`;
    const max = cfg.maxResults ?? 100;

    const results = await webSearch(query, {
      news: true,
      days,
      max,
    });

    for (const r of results) {
      if (!r.url) continue;
      await enqueueStory(cfg.canonical, r.url, "tavily");
      tavilyQueued++;
    }
  } catch (err) {
    console.warn("[news/backfill-90d] Tavily error", cfg.canonical, err);
  }

  return { outlet: cfg.canonical, rssQueued, tavilyQueued };
}

/* ========= Route handlers ========= */

/**
 * POST /api/news/backfill-90d
 *
 * Optional JSON body:
 * {
 *   "outlets": ["npr.org", "bbc.com"],  // defaults to all in OUTLET_CONFIGS
 *   "days": 90                           // default 90
 * }
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError(
        "Supabase admin client not configured.",
        500,
        { code: "NO_SUPABASE_ADMIN" }
      );
    }

    const body = req.body ? await req.json().catch(() => ({})) : {};
    const days = typeof body.days === "number" && body.days > 0 ? body.days : 90;

    const requestedOutlets: string[] | null = Array.isArray(body.outlets)
      ? body.outlets
      : null;

    const targets = requestedOutlets?.length
      ? requestedOutlets
      : OUTLET_CONFIGS.map((c) => c.canonical);

    const results = [];
    for (const canonical of targets) {
      const r = await backfillOutlet(canonical, days);
      results.push(r);
    }

    return NextResponse.json({
      ok: true,
      days,
      outlets: results,
    });
  } catch (err: any) {
    console.error("[news/backfill-90d] fatal error", err);
    return jsonError(
      err?.message || "Unexpected error in news backfill.",
      500,
      { code: "NEWS_BACKFILL_FATAL" }
    );
  }
}

/**
 * Allow GET as a quick manual trigger from the browser:
 * /api/news/backfill-90d?days=90&outlet=npr.org&outlet=bbc.com
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const daysParam = url.searchParams.get("days");
  const days =
    daysParam && !Number.isNaN(Number(daysParam))
      ? Math.max(1, Number(daysParam))
      : 90;

  const outlets = url.searchParams.getAll("outlet");
  const body = JSON.stringify({
    days,
    outlets: outlets.length ? outlets : undefined,
  });

  // Reuse POST implementation
  const fakeReq = new NextRequest(req.url, {
    method: "POST",
    headers: req.headers,
    body,
  });

  return POST(fakeReq);
}

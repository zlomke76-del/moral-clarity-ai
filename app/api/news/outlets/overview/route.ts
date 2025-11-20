// app/api/news/outlets/overview/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ========= ENV / ADMIN CLIENT ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[news/outlets/overview] Missing Supabase admin credentials — API will 500."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

/* ========= TYPES ========= */

type OutletOverview = {
  outlet: string;
  canonical_outlet: string;
  total_stories: number;
  days_active: number;
  avg_bias_intent: number;
  avg_pi: number;
  bias_language: number;
  bias_source: number;
  bias_framing: number;
  bias_context: number;
  last_story_day: string | null;
};

/* ========= HELPERS ========= */

function jsonError(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/**
 * Consolidate domain variants to a canonical outlet ID.
 * Extend as needed.
 */
function canonicalize(outlet: string | null): string {
  if (!outlet) return "unknown";
  const o = outlet.toLowerCase();

  const map: Record<string, string> = {
    "bbc.co.uk": "bbc.com",
    "bbc.com": "bbc.com",
    "www.bbc.com": "bbc.com",

    "france24.com": "france24.com",
    "www.france24.com": "france24.com",

    "reuters.com": "reuters.com",
    "www.reuters.com": "reuters.com",

    "apnews.com": "apnews.com",
    "www.apnews.com": "apnews.com",

    "foxnews.com": "foxnews.com",
    "www.foxnews.com": "foxnews.com",

    "nytimes.com": "nytimes.com",
    "www.nytimes.com": "nytimes.com",

    "politico.com": "politico.com",
    "www.politico.com": "politico.com",

    "dw.com": "dw.com",
    "www.dw.com": "dw.com",

    "rferl.org": "rferl.org",
    "www.rferl.org": "rferl.org",
  };

  return map[o] ?? o;
}

/* ========= MAIN HANDLER ========= */

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase admin client not configured.", 500, {
        code: "NO_SUPABASE_ADMIN",
      });
    }

    // Optional: allow ?minStories=3 for debugging; default 5
    const url = new URL(req.url);
    const minStoriesParam = url.searchParams.get("minStories");
    const parsedMin = Number(minStoriesParam ?? "5");
    const MIN_STORIES =
      Number.isFinite(parsedMin) && parsedMin > 0 ? parsedMin : 5;

    /**
     * Read directly from the ledger table.
     * Expected columns:
     *   outlet
     *   story_day
     *   bias_language_score
     *   bias_source_score
     *   bias_framing_score
     *   bias_context_score
     *   bias_intent_score
     *   pi_score
     */
    const { data, error } = await supabaseAdmin
      .from("news_neutrality_ledger")
      .select(
        `
        outlet,
        story_day,
        bias_language_score,
        bias_source_score,
        bias_framing_score,
        bias_context_score,
        bias_intent_score,
        pi_score
      `
      );

    if (error) {
      console.error("[news/outlets/overview] query error", error);
      return jsonError("Failed to load outlet neutrality data.", 500, {
        code: error.code,
        details: error.details,
      });
    }

    const rows = (data || []) as any[];

    // Aggregate in memory by canonical outlet
    const grouped: Record<
      string,
      {
        outlet: string;
        canonical_outlet: string;
        total_stories: number;
        days_set: Set<string>;
        sum_language: number;
        sum_source: number;
        sum_framing: number;
        sum_context: number;
        sum_bias_intent: number;
        sum_pi: number;
        last_story_day: string | null;
      }
    > = {};

    for (const r of rows) {
      const canon = canonicalize(r.outlet);

      if (!grouped[canon]) {
        grouped[canon] = {
          outlet: canon,
          canonical_outlet: canon,
          total_stories: 0,
          days_set: new Set<string>(),
          sum_language: 0,
          sum_source: 0,
          sum_framing: 0,
          sum_context: 0,
          sum_bias_intent: 0,
          sum_pi: 0,
          last_story_day: null,
        };
      }

      const g = grouped[canon];

      g.total_stories += 1;

      if (r.story_day) {
        g.days_set.add(r.story_day);
        if (!g.last_story_day || r.story_day > g.last_story_day) {
          g.last_story_day = r.story_day;
        }
      }

      g.sum_language += r.bias_language_score ?? 0;
      g.sum_source += r.bias_source_score ?? 0;
      g.sum_framing += r.bias_framing_score ?? 0;
      g.sum_context += r.bias_context_score ?? 0;
      g.sum_bias_intent += r.bias_intent_score ?? 0;
      g.sum_pi += r.pi_score ?? 0;
    }

    const outlets: OutletOverview[] = [];

    for (const canon of Object.keys(grouped)) {
      const g = grouped[canon];

      if (g.total_stories < MIN_STORIES) continue;

      const daysActive = g.days_set.size || 0;

      outlets.push({
        outlet: g.outlet,
        canonical_outlet: g.canonical_outlet,
        total_stories: g.total_stories,
        days_active: daysActive,
        avg_bias_intent: g.sum_bias_intent / g.total_stories,
        avg_pi: g.sum_pi / g.total_stories,
        bias_language: g.sum_language / g.total_stories,
        bias_source: g.sum_source / g.total_stories,
        bias_framing: g.sum_framing / g.total_stories,
        bias_context: g.sum_context / g.total_stories,
        last_story_day: g.last_story_day,
      });
    }

    outlets.sort((a, b) => a.avg_bias_intent - b.avg_bias_intent);

    return NextResponse.json({
      ok: true,
      count: outlets.length,
      outlets,
    });
  } catch (err: any) {
    console.error("[news/outlets/overview] fatal error", err);
    return jsonError(
      err?.message || "Unexpected error in outlets overview.",
      500,
      { code: "NEWS_OUTLETS_OVERVIEW_FATAL" }
    );
  }
}

/* ========= Allow POST to behave as GET ========= */

export async function POST(req: NextRequest) {
  return GET(req);
}

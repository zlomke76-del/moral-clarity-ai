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

/* ========= MAIN HANDLER ========= */

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase admin client not configured.", 500, {
        code: "NO_SUPABASE_ADMIN",
      });
    }

    // Allow ?minStories=1 for debugging; default 5 for production
    const url = new URL(req.url);
    const minStoriesParam = url.searchParams.get("minStories");
    const parsedMin = Number(minStoriesParam ?? "5");
    const MIN_STORIES =
      Number.isFinite(parsedMin) && parsedMin > 0 ? parsedMin : 5;

    /**
     * Source of truth: outlet_bias_pi_daily_trends
     *
     * Columns (confirmed from CSV):
     *   outlet
     *   story_day
     *   outlet_story_count
     *   avg_pi_score
     *   avg_bias_intent
     *   avg_bias_language
     *   avg_bias_source
     *   avg_bias_framing
     *   avg_bias_context
     */
    const { data, error } = await supabaseAdmin
      .from("outlet_bias_pi_daily_trends")
      .select(
        `
        outlet,
        story_day,
        outlet_story_count,
        avg_pi_score,
        avg_bias_intent,
        avg_bias_language,
        avg_bias_source,
        avg_bias_framing,
        avg_bias_context
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

    // Aggregate by outlet using weighted averages by outlet_story_count
    const grouped: Record<
      string,
      {
        outlet: string;
        totalStories: number;
        days: Set<string>;
        sumBiasIntent: number;
        sumPi: number;
        sumLanguage: number;
        sumSource: number;
        sumFraming: number;
        sumContext: number;
        lastDay: string | null;
      }
    > = {};

    for (const r of rows) {
      const outlet: string = r.outlet ?? "unknown";
      const storyDay: string | null = r.story_day ?? null;
      const count: number = Number(r.outlet_story_count ?? 0);

      if (!grouped[outlet]) {
        grouped[outlet] = {
          outlet,
          totalStories: 0,
          days: new Set<string>(),
          sumBiasIntent: 0,
          sumPi: 0,
          sumLanguage: 0,
          sumSource: 0,
          sumFraming: 0,
          sumContext: 0,
          lastDay: null,
        };
      }

      const g = grouped[outlet];

      if (count > 0) {
        g.totalStories += count;

        g.sumBiasIntent += Number(r.avg_bias_intent ?? 0) * count;
        g.sumPi += Number(r.avg_pi_score ?? 0) * count;
        g.sumLanguage += Number(r.avg_bias_language ?? 0) * count;
        g.sumSource += Number(r.avg_bias_source ?? 0) * count;
        g.sumFraming += Number(r.avg_bias_framing ?? 0) * count;
        g.sumContext += Number(r.avg_bias_context ?? 0) * count;
      }

      if (storyDay) {
        g.days.add(storyDay);
        if (!g.lastDay || storyDay > g.lastDay) {
          g.lastDay = storyDay;
        }
      }
    }

    const outlets: OutletOverview[] = [];

    for (const outlet of Object.keys(grouped)) {
      const g = grouped[outlet];

      if (g.totalStories < MIN_STORIES) continue;

      const total = g.totalStories || 1;

      outlets.push({
        outlet,
        canonical_outlet: outlet, // canonical == outlet for now
        total_stories: g.totalStories,
        days_active: g.days.size,
        avg_bias_intent: g.sumBiasIntent / total,
        avg_pi: g.sumPi / total,
        bias_language: g.sumLanguage / total,
        bias_source: g.sumSource / total,
        bias_framing: g.sumFraming / total,
        bias_context: g.sumContext / total,
        last_story_day: g.lastDay,
      });
    }

    // Sort by avg_bias_intent ascending (best → worst)
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

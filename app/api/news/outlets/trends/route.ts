// app/api/news/outlets/trends/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ========= ENV / ADMIN CLIENT ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[news/outlets/trends] Missing Supabase admin credentials — API will 500."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

/* ========= TYPES ========= */

type OutletTrendPoint = {
  story_day: string;
  outlet_story_count: number;
  avg_bias_intent: number;
  avg_pi_score: number;
  avg_bias_language: number;
  avg_bias_source: number;
  avg_bias_framing: number;
  avg_bias_context: number;
};

type TrendsResponse = {
  ok: boolean;
  outlet: string;
  count: number;
  points: OutletTrendPoint[];
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
      return jsonError(
        "Supabase admin client not configured.",
        500,
        { code: "NO_SUPABASE_ADMIN" }
      );
    }

    const url = new URL(req.url);
    const outlet = url.searchParams.get("outlet");

    if (!outlet) {
      return jsonError("Missing ?outlet query parameter.", 400, {
        code: "MISSING_OUTLET",
      });
    }

    // Optional: cap days returned (default 60)
    const limitParam = url.searchParams.get("limit");
    const limit =
      limitParam && !Number.isNaN(Number(limitParam))
        ? Math.max(1, Math.min(Number(limitParam), 120))
        : 60;

    /**
     * Assumes a view/table with daily aggregates per canonical outlet, e.g.:
     *   outlet_bias_pi_daily_trends
     * with columns:
     *   story_day (date/text)
     *   canonical_outlet (text)
     *   outlet_story_count (int)
     *   avg_bias_intent (float)
     *   avg_pi_score (float)
     *   avg_bias_language (float)
     *   avg_bias_source (float)
     *   avg_bias_framing (float)
     *   avg_bias_context (float)
     */
    const { data, error } = await supabaseAdmin
      .from("outlet_bias_pi_daily_trends")
      .select(
        `
        story_day,
        canonical_outlet,
        outlet_story_count,
        avg_bias_intent,
        avg_pi_score,
        avg_bias_language,
        avg_bias_source,
        avg_bias_framing,
        avg_bias_context
      `
      )
      .eq("canonical_outlet", outlet)
      .order("story_day", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("[news/outlets/trends] query error", error);
      return jsonError("Failed to load outlet trend data.", 500, {
        code: error.code,
        details: error.details,
      });
    }

    const rows = (data || []) as any[];

    const points: OutletTrendPoint[] = rows.map((r) => ({
      story_day: r.story_day,
      outlet_story_count: r.outlet_story_count ?? 0,
      avg_bias_intent: r.avg_bias_intent ?? 0,
      avg_pi_score: r.avg_pi_score ?? 0,
      avg_bias_language: r.avg_bias_language ?? 0,
      avg_bias_source: r.avg_bias_source ?? 0,
      avg_bias_framing: r.avg_bias_framing ?? 0,
      avg_bias_context: r.avg_bias_context ?? 0,
    }));

    const resp: TrendsResponse = {
      ok: true,
      outlet,
      count: points.length,
      points,
    };

    return NextResponse.json(resp);
  } catch (err: any) {
    console.error("[news/outlets/trends] fatal error", err);
    return jsonError(
      err?.message || "Unexpected error in outlet trends.",
      500,
      { code: "NEWS_OUTLETS_TRENDS_FATAL" }
    );
  }
}

/* ========= Allow POST to behave as GET ========= */

export async function POST(req: NextRequest) {
  return GET(req);
}

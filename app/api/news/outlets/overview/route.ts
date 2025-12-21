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
  canonical_outlet: string;
  total_stories: number;
  avg_pi: number;
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

    const url = new URL(req.url);
    const minStoriesParam = url.searchParams.get("minStories");
    const parsedMin = Number(minStoriesParam ?? "5");
    const MIN_STORIES =
      Number.isFinite(parsedMin) && parsedMin > 0 ? parsedMin : 5;

    /**
     * 🔒 CANONICAL SOURCE OF TRUTH
     *
     * public.outlet_neutrality_summary
     *
     * Column mapping:
     *   outlet           → canonical_outlet
     *   story_count      → total_stories
     *   avg_pi_score     → avg_pi
     */
    const { data, error } = await supabaseAdmin
      .from("outlet_neutrality_summary")
      .select(`
        outlet,
        story_count,
        avg_pi_score
      `)
      .gte("story_count", MIN_STORIES);

    if (error) {
      console.error("[news/outlets/overview] query error", error);
      return jsonError("Failed to load outlet overview.", 500, {
        code: error.code,
        details: error.details,
      });
    }

    const outlets: OutletOverview[] = (data || []).map((row: any) => ({
      canonical_outlet: row.outlet,
      total_stories: Number(row.story_count),
      avg_pi: Number(row.avg_pi_score),
    }));

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

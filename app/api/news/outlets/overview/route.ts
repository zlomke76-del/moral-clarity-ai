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

export async function GET(_req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase admin client not configured.", 500, {
        code: "NO_SUPABASE_ADMIN",
      });
    }

    /**
     * We use the lifetime overview view:
     *   outlet_bias_pi_lifetime_overview
     *
     * Expected columns:
     *   outlet
     *   canonical_outlet
     *   total_stories
     *   days_active
     *   avg_bias_intent
     *   avg_pi
     *   bias_language
     *   bias_source
     *   bias_framing
     *   bias_context
     *   last_story_day
     */

    const { data, error } = await supabaseAdmin
      .from("outlet_bias_pi_lifetime_overview")
      .select(
        `
        outlet,
        canonical_outlet,
        total_stories,
        days_active,
        avg_bias_intent,
        avg_pi,
        bias_language,
        bias_source,
        bias_framing,
        bias_context,
        last_story_day
      `
      )
      .gte("total_stories", 5) // only show outlets with enough story volume
      .order("avg_bias_intent", { ascending: true });

    if (error) {
      console.error("[news/outlets/overview] query error", error);
      return jsonError("Failed to load outlet neutrality data.", 500, {
        code: error.code,
        details: error.details,
      });
    }

    const rows = (data || []) as any[];

    const outlets: OutletOverview[] = rows.map((r) => ({
      outlet: r.outlet ?? r.canonical_outlet ?? "unknown",
      canonical_outlet: r.canonical_outlet ?? r.outlet ?? "unknown",
      total_stories: Number(r.total_stories ?? 0),
      days_active: Number(r.days_active ?? 0),
      avg_bias_intent: Number(r.avg_bias_intent ?? 0),
      avg_pi: Number(r.avg_pi ?? 0),
      bias_language: Number(r.bias_language ?? 0),
      bias_source: Number(r.bias_source ?? 0),
      bias_framing: Number(r.bias_framing ?? 0),
      bias_context: Number(r.bias_context ?? 0),
      last_story_day: r.last_story_day ?? null,
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

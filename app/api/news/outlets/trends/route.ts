/* app/api/news/outlets/trends/route.ts */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("[outlets/trends] Missing Supabase admin credentials.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export type OutletTrendPoint = {
  story_day: string;
  outlet_story_count: number;
  avg_bias_intent: number;
  avg_pi_score: number;
  avg_bias_language: number;
  avg_bias_source: number;
  avg_bias_framing: number;
  avg_bias_context: number;
};

function jsonError(message: string, status = 500, extra: any = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const outlet = url.searchParams.get("outlet");

    if (!outlet) {
      return jsonError("Missing 'outlet' parameter.", 400, { code: "NO_OUTLET" });
    }

    const { data, error } = await supabase
      .from("outlet_bias_pi_daily_trends_norm")
      .select(
        "story_day, outlet_story_count, avg_bias_intent, avg_pi_score, avg_bias_language, avg_bias_source, avg_bias_framing, avg_bias_context"
      )
      .eq("outlet_canonical", outlet)
      .order("story_day", { ascending: true });

    if (error) {
      console.error("[outlets/trends] Supabase error:", error);
      return jsonError("Failed to load outlet trends.", 500, {
        details: error.message,
      });
    }

    const points = (data || []) as OutletTrendPoint[];

    return NextResponse.json({
      ok: true,
      outlet,
      count: points.length,
      points,
    });
  } catch (err: any) {
    console.error("[outlets/trends] fatal error:", err);
    return jsonError(err?.message || "Unexpected server error.");
  }
}

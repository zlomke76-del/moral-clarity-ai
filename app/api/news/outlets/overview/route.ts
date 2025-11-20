/* app/api/news/outlets/overview/route.ts */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ========= ENV ========= */

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("[outlets/overview] Missing Supabase admin credentials.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/* ========= TYPES ========= */

type OutletOverviewRow = {
  outlet: string;
  total_stories: number | null;
  days_active: number | null;
  avg_bias_intent_weighted: number | null;
  avg_pi_weighted: number | null;
  avg_bias_language_weighted: number | null;
  avg_bias_source_weighted: number | null;
  avg_bias_framing_weighted: number | null;
  avg_bias_context_weighted: number | null;
  last_story_day: string | null;
};

export type OutletOverview = {
  outlet: string;            // canonical outlet (domain-ish label)
  canonical_outlet: string;  // same as outlet, explicit for UI clarity
  total_stories: number;
  days_active: number;
  avg_bias_intent: number;   // 0–3   lower = less bias
  avg_pi: number;            // 0–1   higher = more neutral
  bias_language: number;
  bias_source: number;
  bias_framing: number;
  bias_context: number;
  last_story_day: string | null;
};

/* ========= HELPERS ========= */

function jsonError(message: string, status = 500, extra: any = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/* ========= HANDLER ========= */

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const limitParam = url.searchParams.get("limit");
    const sort = url.searchParams.get("sort") || "avg_bias_intent";
    const order = url.searchParams.get("order") === "desc" ? "desc" : "asc";

    const limit =
      limitParam && !Number.isNaN(Number(limitParam))
        ? Math.max(1, Math.min(Number(limitParam), 100))
        : null;

    const { data, error } = await supabase
      .from("outlet_bias_pi_overview")
      .select("*");

    if (error) {
      console.error("[outlets/overview] Supabase error:", error);
      return jsonError("Failed to load outlet bias overview.", 500, {
        details: error.message,
      });
    }

    const rows = (data || []) as OutletOverviewRow[];

    const normalized: OutletOverview[] = rows.map((r) => {
      const biasIntent = r.avg_bias_intent_weighted ?? 0;
      const pi = r.avg_pi_weighted ?? (1 - biasIntent / 3);

      return {
        outlet: r.outlet,
        canonical_outlet: r.outlet,
        total_stories: r.total_stories ?? 0,
        days_active: r.days_active ?? 0,
        avg_bias_intent: Number(biasIntent.toFixed(3)),
        avg_pi: Number(pi.toFixed(3)),
        bias_language: Number((r.avg_bias_language_weighted ?? 0).toFixed(3)),
        bias_source: Number((r.avg_bias_source_weighted ?? 0).toFixed(3)),
        bias_framing: Number((r.avg_bias_framing_weighted ?? 0).toFixed(3)),
        bias_context: Number((r.avg_bias_context_weighted ?? 0).toFixed(3)),
        last_story_day: r.last_story_day,
      };
    });

    normalized.sort((a, b) => {
      const A = (a as any)[sort] ?? 0;
      const B = (b as any)[sort] ?? 0;
      return order === "asc" ? A - B : B - A;
    });

    const final = limit ? normalized.slice(0, limit) : normalized;

    return NextResponse.json({
      ok: true,
      count: final.length,
      outlets: final,
    });
  } catch (err: any) {
    console.error("[outlets/overview] fatal error:", err);
    return jsonError(err?.message || "Unexpected server error.");
  }
}

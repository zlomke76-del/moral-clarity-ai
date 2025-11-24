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

/* ========= HELPERS ========= */

function jsonError(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

function applyCanonical(
  outlet: string,
  aliasMap: Record<string, string>
): string {
  const lower = outlet.toLowerCase().trim();
  return aliasMap[lower] ?? lower;
}

/* ========= MAIN HANDLER ========= */

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase admin client not configured.", 500);
    }

    /* ==========================================================
     * 1) Load canonical alias mapping
     * ========================================================== */
    const { data: aliasRows, error: aliasErr } = await supabaseAdmin
      .from("news_outlet_aliases")
      .select("alias, canonical");

    if (aliasErr) {
      console.error("[overview] alias table error", aliasErr);
      return jsonError("Failed to load outlet alias table.", 500);
    }

    const aliasMap: Record<string, string> = {};
    for (const row of aliasRows || []) {
      if (row.alias && row.canonical) {
        aliasMap[row.alias.toLowerCase()] = row.canonical.toLowerCase();
      }
    }

    /* ==========================================================
     * 2) Load all trend rows
     * ========================================================== */
    const { data, error } = await supabaseAdmin
      .from("outlet_bias_pi_daily_trends")
      .select(`
        outlet,
        story_day,
        outlet_story_count,
        avg_pi_score,
        avg_bias_intent,
        avg_bias_language,
        avg_bias_source,
        avg_bias_framing,
        avg_bias_context
      `);

    if (error) {
      console.error("[overview] query error", error);
      return jsonError("Failed to load outlet neutrality data.", 500);
    }

    const rows = (data || []) as any[];

    /* ==========================================================
     * 3) Group by canonical outlet
     * ========================================================== */

    const grouped: Record<
      string,
      {
        canonical: string;
        totalStories: number;
        days: Set<string>;
        firstDay: string | null;
        lastDay: string | null;

        sumBiasIntent: number;
        sumPi: number;
        sumLang: number;
        sumSource: number;
        sumFrame: number;
        sumCtx: number;
      }
    > = {};

    for (const r of rows) {
      const rawOutlet = String(r.outlet ?? "").trim().toLowerCase();
      const canonical = applyCanonical(rawOutlet, aliasMap);

      const storyDay: string | null = r.story_day ?? null;
      const count: number = Number(r.outlet_story_count ?? 0);

      if (!grouped[canonical]) {
        grouped[canonical] = {
          canonical,
          totalStories: 0,
          days: new Set(),
          firstDay: null,
          lastDay: null,

          sumBiasIntent: 0,
          sumPi: 0,
          sumLang: 0,
          sumSource: 0,
          sumFrame: 0,
          sumCtx: 0,
        };
      }

      const g = grouped[canonical];

      if (count > 0) {
        g.totalStories += count;
        g.sumBiasIntent += Number(r.avg_bias_intent || 0) * count;
        g.sumPi += Number(r.avg_pi_score || 0) * count;
        g.sumLang += Number(r.avg_bias_language || 0) * count;
        g.sumSource += Number(r.avg_bias_source || 0) * count;
        g.sumFrame += Number(r.avg_bias_framing || 0) * count;
        g.sumCtx += Number(r.avg_bias_context || 0) * count;
      }

      if (storyDay) {
        g.days.add(storyDay);

        if (!g.firstDay || storyDay < g.firstDay) {
          g.firstDay = storyDay;
        }
        if (!g.lastDay || storyDay > g.lastDay) {
          g.lastDay = storyDay;
        }
      }
    }

    /* ==========================================================
     * 4) Filter by minimum story count
     * ========================================================== */
    const url = new URL(req.url);
    const minParam = url.searchParams.get("minStories");
    const min = Math.max(1, Number(minParam ?? "5") || 5);

    const outlets = Object.values(grouped)
      .filter((g) => g.totalStories >= min)
      .map((g) => {
        const total = g.totalStories || 1;

        return {
          outlet: g.canonical,
          canonical_outlet: g.canonical,
          total_stories: g.totalStories,
          days_active: g.days.size,

          avg_bias_intent: g.sumBiasIntent / total,
          avg_pi: g.sumPi / total,

          bias_language: g.sumLang / total,
          bias_source: g.sumSource / total,
          bias_framing: g.sumFrame / total,
          bias_context: g.sumCtx / total,

          first_scored_date: g.firstDay,
          most_recent_date: g.lastDay,
        };
      });

    // Sort best → worst by bias intent
    outlets.sort((a, b) => a.avg_bias_intent - b.avg_bias_intent);

    return NextResponse.json({
      ok: true,
      count: outlets.length,
      outlets,
    });
  } catch (err: any) {
    console.error("[overview] fatal error", err);
    return jsonError(
      err?.message || "Unexpected error in outlets overview.",
      500
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}



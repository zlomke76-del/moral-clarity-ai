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
     * 🔒 CANONICAL READ-TIME COLLAPSE
     *
     * Source table:
     *   outlet_neutrality_summary
     *     - outlet           (source_domain)
     *     - story_count
     *     - avg_pi_score
     *
     * Identity table:
     *   outlet_domain_map
     *     - source_domain
     *     - canonical_outlet
     *     - active
     *
     * Rules:
     *   - Canonicalization happens ONLY here (read-time)
     *   - PI is weighted by story_count
     *   - Unmapped domains surface as 'UNMAPPED'
     *   - No data is mutated or persisted
     */

    const { data, error } = await supabaseAdmin.rpc(
      "sql",
      {
        query: `
          SELECT
            COALESCE(m.canonical_outlet, 'UNMAPPED') AS canonical_outlet,
            SUM(s.story_count)::bigint               AS total_stories,
            CASE
              WHEN SUM(s.story_count) > 0
              THEN SUM(s.avg_pi_score * s.story_count) / SUM(s.story_count)
              ELSE NULL
            END                                     AS avg_pi
          FROM outlet_neutrality_summary s
          LEFT JOIN outlet_domain_map m
            ON s.outlet = m.source_domain
           AND m.active = true
          WHERE s.story_count >= $1
          GROUP BY COALESCE(m.canonical_outlet, 'UNMAPPED')
          ORDER BY avg_pi DESC NULLS LAST
        `,
        params: [MIN_STORIES],
      }
    );

    if (error) {
      console.error("[news/outlets/overview] query error", error);
      return jsonError("Failed to load outlet overview.", 500, {
        code: error.code,
        details: error.message,
      });
    }

    const outlets: OutletOverview[] = (data || []).map((row: any) => ({
      canonical_outlet: row.canonical_outlet,
      total_stories: Number(row.total_stories),
      avg_pi: Number(row.avg_pi),
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

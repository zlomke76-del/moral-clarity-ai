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

/** AUTO-CANONICALIZATION (root domain collapse)
 *  - newsfeed.time.com → time.com
 *  - radio.foxnews.com → foxnews.com
 *  - newsletters.washingtonexaminer.com → washingtonexaminer.com
 *  - about.rferl.org → rferl.org
 *  - support.anything.co.uk → anything.co.uk
 */
function canonicalizeAuto(domain: string): string {
  if (!domain) return "unknown";

  const parts = domain.toLowerCase().split(".");
  if (parts.length <= 2) return domain.toLowerCase();

  const last = parts.at(-1)!;
  const secondLast = parts.at(-2)!;

  // Handle .co.uk pattern
  if (secondLast === "co" && last === "uk") {
    return parts.slice(-3).join(".");
  }

  return `${secondLast}.${last}`;
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
    const inputOutlet = url.searchParams.get("outlet");

    if (!inputOutlet) {
      return jsonError("Missing ?outlet query parameter.", 400, {
        code: "MISSING_OUTLET",
      });
    }

    // Load alias map for manual overrides
    const { data: aliasRows } = await supabaseAdmin
      .from("news_outlet_aliases")
      .select("alias, canonical");

    const aliasMap: Record<string, string> = {};
    for (const r of aliasRows ?? []) {
      aliasMap[r.alias.toLowerCase()] = r.canonical.toLowerCase();
    }

    // Normalize incoming outlet using alias → else auto-root
    const normalizedOutlet =
      aliasMap[inputOutlet.toLowerCase()] ??
      canonicalizeAuto(inputOutlet.toLowerCase());

    // Optional: limit days returned (default 60)
    const limitParam = url.searchParams.get("limit");
    const limit =
      limitParam && !Number.isNaN(Number(limitParam))
        ? Math.max(1, Math.min(Number(limitParam), 120))
        : 60;

    // Query ANY row whose canonical form matches the normalized target
    const { data, error } = await supabaseAdmin
      .rpc("match_outlet_trends_canonical", {
        p_canonical: normalizedOutlet,
        p_limit: limit,
      });

    if (error) {
      console.error("[news/outlets/trends] RPC error", error);
      return jsonError("Failed to load outlet trend data.", 500, {
        code: error.code,
        details: error.details,
      });
    }

    const rows = (data || []) as any[];

    const points: OutletTrendPoint[] = rows.map((r) => ({
      story_day: r.story_day,
      outlet_story_count: Number(r.outlet_story_count ?? 0),
      avg_bias_intent: Number(r.avg_bias_intent ?? 0),
      avg_pi_score: Number(r.avg_pi_score ?? 0),
      avg_bias_language: Number(r.avg_bias_language ?? 0),
      avg_bias_source: Number(r.avg_bias_source ?? 0),
      avg_bias_framing: Number(r.avg_bias_framing ?? 0),
      avg_bias_context: Number(r.avg_bias_context ?? 0),
    }));

    const resp: TrendsResponse = {
      ok: true,
      outlet: normalizedOutlet,
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

/* ========= POST = GET ========= */

export async function POST(req: NextRequest) {
  return GET(req);
}

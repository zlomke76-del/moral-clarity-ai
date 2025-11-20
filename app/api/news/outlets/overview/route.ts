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

export type OutletOverview = {
  outlet: string;
  canonical_outlet: string;
  total_stories: number;
  avg_bias_intent: number;
  latest_story_date: string | null;
  first_seen: string | null;
  last_seen: string | null;
};

/* ========= HELPERS ========= */

/** Normalize domains so edition.cnn.com → cnn.com, m.bbc.com → bbc.com */
function canonicalize(outlet: string | null | undefined): string {
  if (!outlet) return "unknown";

  let o = outlet.trim().toLowerCase();

  o = o.replace(/^www\./, "");
  o = o.replace(/^m\./, "");
  o = o.replace(/^edition\./, "");
  o = o.replace(/^amp\./, "");

  // Reduce multi-level domains to root domain (cnn.com)
  const parts = o.split(".");
  if (parts.length > 2) {
    o = parts.slice(parts.length - 2).join(".");
  }

  return o;
}

function jsonError(message: string, status = 500, extra: any = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/* ========= HANDLER ========= */

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // optional query params
    const limit = Number(url.searchParams.get("limit")) || null;
    const sort = url.searchParams.get("sort") || "avg_bias_intent"; 
    const order = url.searchParams.get("order") === "desc" ? "desc" : "asc";

    // Fetch raw rows from the materialized view or normal view
    const { data, error } = await supabase
      .from("outlet_bias_pi_overview")
      .select("*");

    if (error) {
      console.error("[outlets/overview] Supabase error:", error);
      return jsonError("Failed to load outlet bias overview.", 500, {
        details: error.message,
      });
    }

    const rows = (data || []) as OutletOverview[];

    /* === Consolidate variants of same outlet === */

    const map = new Map<
      string,
      {
        outlet: string;
        canonical_outlet: string;
        total_stories: number;
        avg_bias_intent_accum: number;
        count: number;
        first_seen: string | null;
        last_seen: string | null;
      }
    >();

    for (const r of rows) {
      const canonical = canonicalize(r.outlet);

      if (!map.has(canonical)) {
        map.set(canonical, {
          outlet: r.outlet,
          canonical_outlet: canonical,
          total_stories: r.total_stories ?? 0,
          avg_bias_intent_accum: r.avg_bias_intent ?? 0,
          count: 1,
          first_seen: r.first_seen ?? null,
          last_seen: r.last_seen ?? null,
        });
      } else {
        const e = map.get(canonical)!;
        e.total_stories += r.total_stories ?? 0;
        e.avg_bias_intent_accum += r.avg_bias_intent ?? 0;
        e.count++;
        // Update first_seen and last_seen
        if (r.first_seen && (!e.first_seen || r.first_seen < e.first_seen)) {
          e.first_seen = r.first_seen;
        }
        if (r.last_seen && (!e.last_seen || r.last_seen > e.last_seen)) {
          e.last_seen = r.last_seen;
        }
      }
    }

    const consolidated = Array.from(map.values()).map((e) => ({
      outlet: e.outlet,
      canonical_outlet: e.canonical_outlet,
      total_stories: e.total_stories,
      avg_bias_intent: Number((e.avg_bias_intent_accum / e.count).toFixed(3)),
      first_seen: e.first_seen,
      last_seen: e.last_seen,
      latest_story_date: e.last_seen,
    }));

    /* === Sorting === */

    consolidated.sort((a, b) => {
      const A = (a as any)[sort] ?? 0;
      const B = (b as any)[sort] ?? 0;
      return order === "asc" ? A - B : B - A;
    });

    /* === Limit (optional) === */
    const final = limit ? consolidated.slice(0, limit) : consolidated;

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

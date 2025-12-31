import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/news/outlet-stats?outlet=<canonical_outlet>
 *
 * Canonical-only stats endpoint.
 * Domain-style identifiers (e.g. wsj.com) are explicitly rejected.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const outlet = searchParams.get("outlet");

  // Hard guard: missing param
  if (!outlet) {
    return NextResponse.json(
      { ok: false, error: "Missing outlet parameter" },
      { status: 400 }
    );
  }

  // Canonical enforcement
  if (outlet.includes(".")) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid outlet identifier. Expected canonical_outlet.",
      },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("outlet_bias_pi_overview")
    .select(`
      canonical_outlet,
      total_stories,
      days_active,
      last_story_day,
      avg_pi_weighted,
      avg_bias_intent_weighted,
      avg_bias_language_weighted,
      avg_bias_source_weighted,
      avg_bias_framing_weighted,
      avg_bias_context_weighted
    `)
    .eq("canonical_outlet", outlet)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    outlet: data ?? null, // PATCH: do not remap field, keep canonical_outlet
  });
}

// app/api/news/outlets/[outlet]/stats/route.ts

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { outlet: string } }
) {
  const outlet = params.outlet;

  // 🔒 Hard guard — missing param
  if (!outlet) {
    return NextResponse.json(
      { ok: false, error: "Missing outlet parameter" },
      { status: 400 }
    );
  }

  // 🧨 LEGACY ROUTE KILL SWITCH
  // Domain-style identifiers are permanently unsupported.
  // 410 tells Next.js + browser to STOP retrying.
  if (outlet.includes(".")) {
    return NextResponse.json(
      {
        ok: false,
        error: "Legacy domain-based outlet route permanently removed",
      },
      { status: 410 }
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
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        ok: false,
        error: "Outlet not found for provided canonical_outlet",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    outlet: data,
  });
}

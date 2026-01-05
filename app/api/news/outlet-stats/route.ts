import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const outlet = searchParams.get("outlet");

  if (!outlet) {
    return NextResponse.json(
      { ok: false, error: "Missing outlet parameter" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("outlet_bias_pi_overview")
    .select(`
      outlet,
      total_stories,
      days_active,
      last_story_day,
      avg_bias_intent_weighted,
      avg_pi_weighted,
      avg_bias_language_weighted,
      avg_bias_source_weighted,
      avg_bias_framing_weighted,
      avg_bias_context_weighted
    `)
    .eq("outlet", outlet)
    .maybeSingle();

  if (error) {
    console.error("API error at /api/news/outlet-stats", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    outlet: data ?? null,
  });
}

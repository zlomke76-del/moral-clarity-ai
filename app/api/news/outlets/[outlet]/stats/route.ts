import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { outlet: string } }
) {
  const outlet = params.outlet?.toLowerCase();

  if (!outlet) {
    return NextResponse.json(
      { ok: false, error: "Missing outlet parameter" },
      { status: 400 }
    );
  }

  const supabase = createClientServer();

  const { data, error } = await supabase
    .from("outlet_bias_pi_overview")
    .select(`
      outlet,
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
    .eq("outlet", outlet)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Outlet not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    outlet: data.outlet,
    total_stories: data.total_stories,
    days_active: data.days_active,
    last_story_day: data.last_story_day,

    avg_pi_weighted: data.avg_pi_weighted,
    avg_bias_intent_weighted: data.avg_bias_intent_weighted,
    avg_bias_language_weighted: data.avg_bias_language_weighted,
    avg_bias_source_weighted: data.avg_bias_source_weighted,
    avg_bias_framing_weighted: data.avg_bias_framing_weighted,
    avg_bias_context_weighted: data.avg_bias_context_weighted,
  });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("outlet_bias_pi_overview")
    .select(`
      canonical_outlet,
      total_stories,
      avg_pi_weighted,
      avg_bias_intent_weighted,
      avg_bias_language_weighted,
      avg_bias_source_weighted,
      avg_bias_framing_weighted,
      avg_bias_context_weighted,
      last_story_day
    `);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  // 🔒 CONTRACT ADAPTER — NO RE-ENGINEERING
  const outlets = (data ?? []).map((row) => ({
    canonical_outlet: row.canonical_outlet,
    total_stories: row.total_stories,

    // 🔑 THIS IS THE FIX
    avg_pi: row.avg_pi_weighted,

    avg_bias_intent: row.avg_bias_intent_weighted,
    bias_language: row.avg_bias_language_weighted,
    bias_source: row.avg_bias_source_weighted,
    bias_framing: row.avg_bias_framing_weighted,
    bias_context: row.avg_bias_context_weighted,

    last_story_day: row.last_story_day,
  }));

  return NextResponse.json({
    ok: true,
    count: outlets.length,
    outlets,
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function GET(
  req: NextRequest,
  { params }: { params: { outlet: string } }
) {
  const outlet = decodeURIComponent(params.outlet);

  const { data, error } = await supabase
    .from("outlet_bias_pi_overall")
    .select(`
      outlet,
      total_stories,
      days_active,
      last_story_day,
      avg_pi_score,
      avg_bias_intent,
      avg_bias_language,
      avg_bias_source,
      avg_bias_framing,
      avg_bias_context
    `)
    .eq("outlet", outlet)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: "Outlet stats not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    outlet: {
      outlet: data.outlet,
      total_stories: data.total_stories,
      days_active: data.days_active,
      last_story_day: data.last_story_day,

      avg_pi_weighted: data.avg_pi_score,

      avg_bias_intent_weighted: data.avg_bias_intent,
      avg_bias_language_weighted: data.avg_bias_language,
      avg_bias_source_weighted: data.avg_bias_source,
      avg_bias_framing_weighted: data.avg_bias_framing,
      avg_bias_context_weighted: data.avg_bias_context,
    },
  });
}

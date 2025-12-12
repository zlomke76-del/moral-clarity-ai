// app/api/explain/route.ts
// Returns explanation for a prior system decision

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  const {
    user_key,
    audit_type,   // "proactivity" | "memory"
    audit_id,
  } = await req.json();

  if (!user_key || !audit_type || !audit_id) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  const table =
    audit_type === "proactivity"
      ? "proactivity_audit"
      : "memory_audit";

  const { data, error } = await supabase
    .from(table)
    .select("explanation, rationale, created_at")
    .eq("id", audit_id)
    .eq("user_id", user_key)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Explanation not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    explanation: data.explanation,
    details: data.rationale,
    created_at: data.created_at,
  });
}

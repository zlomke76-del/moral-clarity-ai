import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();

  const { data: relationship, error } = await supabase
    .from("memory.relationships")
    .select(`
      *,
      contacts:memory.relationship_contacts(*),
      markers:memory.time_markers(*)
    `)
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(relationship);
}

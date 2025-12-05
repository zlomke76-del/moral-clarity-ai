import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// ------------------------------------------------------------
// POST — create a new memory
// ------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.content || !body.user_email) {
      return NextResponse.json(
        { error: "Missing content or user_email" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("memories")
      .insert({
        title: body.title,
        content: body.content,
        kind: body.kind ?? "note",
        user_email: body.user_email,
        workspace_id: body.workspace_id ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, row: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Failed" },
      { status: 500 }
    );
  }
}

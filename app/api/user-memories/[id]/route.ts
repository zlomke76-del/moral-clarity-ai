// app/api/user-memories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function sb() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase env vars missing");
  }
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

// PATCH /api/user-memories/:id
// body: { title?, content?, kind?, importance?, episode_summary? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json().catch(() => ({}));

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const update: Record<string, any> = {};
    if (typeof body.title === "string") update.title = body.title;
    if (typeof body.content === "string") update.content = body.content;
    if (typeof body.kind === "string") update.kind = body.kind;
    if (typeof body.episode_summary === "string")
      update.episode_summary = body.episode_summary;
    if (typeof body.importance === "number") update.importance = body.importance;

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No updatable fields provided" },
        { status: 400 }
      );
    }

    const client = sb();
    const { data, error } = await client
      .from("user_memories")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[user-memories] PATCH error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ row: data });
  } catch (err: any) {
    console.error("[user-memories] PATCH exception", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

// DELETE /api/user-memories/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const client = sb();
    const { error } = await client.from("user_memories").delete().eq("id", id);

    if (error) {
      console.error("[user-memories] DELETE error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[user-memories] DELETE exception", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

// app/api/user-memories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userKey = user.email || user.id;
    if (!userKey) {
      return NextResponse.json(
        { error: "User has no email/id" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));

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

    const { data, error } = await supabase
      .from("user_memories")
      .update(update)
      .eq("id", id)
      .eq("user_key", userKey) // critical: cannot edit others' rows
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userKey = user.email || user.id;
    if (!userKey) {
      return NextResponse.json(
        { error: "User has no email/id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("user_memories")
      .delete()
      .eq("id", id)
      .eq("user_key", userKey); // cannot delete others' memories

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


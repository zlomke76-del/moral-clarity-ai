import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/* ============================================================
   Shared auth + client bootstrap
============================================================ */
async function getAuthedSupabase(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Missing or invalid Authorization header" };
  }

  const accessToken = authHeader.replace("Bearer ", "").trim();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { error: "Unauthorized" };
  }

  return { supabase, userId: data.user.id };
}

/* ============================================================
   PATCH — update memory content
============================================================ */
export async function PATCH(
  req: Request,
  { params }: { params: { id?: string } }
) {
  try {
    const memoryId = params?.id;
    if (!memoryId) {
      return NextResponse.json(
        { error: "Memory ID is required" },
        { status: 400 }
      );
    }

    const auth = await getAuthedSupabase(req);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const { data, error } = await auth.supabase
      .schema("memory")
      .from("memories")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memoryId)
      .eq("user_id", auth.userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Memory not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

/* ============================================================
   DELETE — explicit memory removal
============================================================ */
export async function DELETE(
  req: Request,
  { params }: { params: { id?: string } }
) {
  try {
    const memoryId = params?.id;
    if (!memoryId) {
      return NextResponse.json(
        { error: "Memory ID is required" },
        { status: 400 }
      );
    }

    const auth = await getAuthedSupabase(req);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { error } = await auth.supabase
      .schema("memory")
      .from("memories")
      .delete()
      .eq("id", memoryId)
      .eq("user_id", auth.userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

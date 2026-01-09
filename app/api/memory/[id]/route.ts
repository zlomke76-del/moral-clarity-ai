// app/api/memory/[id]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/* ------------------------------------------------------------
   Helper: resolve ID defensively (router-safe)
------------------------------------------------------------ */
function resolveId(req: Request, params?: { id?: string }) {
  if (params?.id) return params.id;

  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------
   Shared auth + Supabase bootstrap
------------------------------------------------------------ */
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

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return { error: "Unauthorized" };
  }

  return { supabase, user: userData.user };
}

/* ------------------------------------------------------------
   PATCH /api/memory/[id]
------------------------------------------------------------ */
export async function PATCH(
  req: Request,
  { params }: { params: { id?: string } }
) {
  try {
    const memoryId = resolveId(req, params);

    if (!memoryId) {
      return NextResponse.json(
        { error: "Memory ID is required" },
        { status: 400 }
      );
    }

    const auth = await getAuthedSupabase(req);
    if ("error" in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const { supabase, user } = auth;

    const body = await req.json();
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .schema("memory")
      .from("memories")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memoryId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Memory not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------
   DELETE /api/memory/[id]
------------------------------------------------------------ */
export async function DELETE(
  req: Request,
  { params }: { params: { id?: string } }
) {
  try {
    const memoryId = resolveId(req, params);

    if (!memoryId) {
      return NextResponse.json(
        { error: "Memory ID is required" },
        { status: 400 }
      );
    }

    const auth = await getAuthedSupabase(req);
    if ("error" in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const { supabase, user } = auth;

    const { error: deleteError } = await supabase
      .schema("memory")
      .from("memories")
      .delete()
      .eq("id", memoryId)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

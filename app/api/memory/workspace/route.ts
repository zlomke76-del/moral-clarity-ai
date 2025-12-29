// app/api/memory/workspace/route.ts
// ============================================================
// WORKSPACE MEMORY API — TOKEN AUTH ONLY
// Individual user memory boundary
// ============================================================
// - Explicit Authorization: Bearer <access_token>
// - No cookies
// - No implicit session recovery
// - Edge-safe, gateway-safe
// ============================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId required" },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 🔒 EXPLICIT TOKEN AUTH
    // ------------------------------------------------------------
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "unauthenticated" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "unauthenticated" },
        { status: 401 }
      );
    }

    // ------------------------------------------------------------
    // 🔒 INDIVIDUAL MEMORY ONLY
    // ------------------------------------------------------------
    const { data, error } = await supabase
      .schema("memory")
      .from("memories")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      items: data ?? [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

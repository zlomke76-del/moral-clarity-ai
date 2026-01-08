import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    /* ------------------------------------------------------------
       AUTH: Bearer token required
    ------------------------------------------------------------ */
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    /* ------------------------------------------------------------
       Supabase client bound to user access token
       (RLS-safe, no cookie mutation)
    ------------------------------------------------------------ */
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ------------------------------------------------------------
       Query params
    ------------------------------------------------------------ */
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    /* ------------------------------------------------------------
       AUTHORITATIVE MEMORY QUERY
       Return ONLY user Fact memories
       Exclude system rows entirely
       Supabase v2 schema-correct query
    ------------------------------------------------------------ */
    const { data: items, error: memError } = await supabase
      .schema("memory")
      .from("memories")
      .select(`
        id,
        user_id,
        email,
        workspace_id,
        memory_type,
        source,
        content,
        weight,
        confidence,
        sensitivity,
        emotional_weight,
        is_active,
        metadata,
        promoted_at,
        conversation_id,
        created_at,
        updated_at
      `)
      .eq("workspace_id", workspaceId)
      .eq("user_id", userData.user.id)
      .eq("memory_type", "fact")
      .neq("source", "system")
      .neq("email", "system")
      .order("updated_at", { ascending: false });

    if (memError) {
      return NextResponse.json(
        { error: memError.message },
        { status: 500 }
      );
    }

    /* ------------------------------------------------------------
       Success
    ------------------------------------------------------------ */
    return NextResponse.json({
      items: items ?? [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

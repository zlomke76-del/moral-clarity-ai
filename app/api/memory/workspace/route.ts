import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    // Server-side Supabase client bound to access token
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

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    // 🔑 AUTHORITATIVE MEMORY QUERY
    const { data: items, error: memError } = await supabase
      .from("memory.memories")
      .select(
        `
        id,
        content,
        memory_type,
        fact_type,
        confidence,
        priority,
        created_at,
        updated_at
      `
      )
      .eq("workspace_id", workspaceId)
      .eq("user_id", userData.user.id)
      .order("updated_at", { ascending: false });

    if (memError) {
      return NextResponse.json(
        { error: memError.message },
        { status: 500 }
      );
    }

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

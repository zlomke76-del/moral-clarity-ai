import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    // Auth: Bearer token in Authorization header
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const accessToken = auth.replace("Bearer ", "").trim();
    const supabase = createSupabaseServerClient(accessToken);

    // Validate Supabase session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // Get workspaceId from query
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing workspaceId" },
        { status: 400 }
      );
    }

    // Query memory.memories relation in the memory schema
    const { data, error } = await supabase
      .schema("memory")
      .from("memories")
      .select(`
        id,
        workspace_id,
        title,
        content,
        created_at,
        updated_at
      `)
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[MEMORY API] query error", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (err: any) {
    console.error("[MEMORY API] fatal", err);
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    console.log("[MEMORY-API] request", { workspaceId });

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId required" },
        { status: 400 }
      );
    }

    const supabase = createClientServer();
    console.log("[MEMORY-API] supabase client created");

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    console.log("[MEMORY-API] query result", {
      count: data?.length,
      error,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (err: any) {
    console.error("[MEMORY-API] fatal error", err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

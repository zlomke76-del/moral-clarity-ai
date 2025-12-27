import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId required" },
      { status: 400 }
    );
  }

  const supabase = createClientServer();

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data ?? [] });
}

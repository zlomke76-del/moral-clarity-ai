// ------------------------------------------------------------
// Rolodex Workspace Route (COOKIE AUTH · RLS SAFE · SCHEMA BOUND)
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "memory" },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export async function GET(req: Request) {
  const supabase = await getSupabase();

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { ok: false, error: "unauthenticated" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { ok: false, error: "workspaceId is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("rolodex")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, stage: "select.rolodex", error },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, items: data });
}

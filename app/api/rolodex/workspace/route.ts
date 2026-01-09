// ------------------------------------------------------------
// Rolodex Workspace Route (COOKIE AUTH · RLS SAFE · SCHEMA BOUND)
// Matches new authoritative Rolodex API architecture
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

/* ------------------------------------------------------------
   Supabase (schema-bound, cookie-auth)
------------------------------------------------------------ */
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

/* ------------------------------------------------------------
   GET /api/rolodex/workspace?workspaceId=...
------------------------------------------------------------ */
export async function GET(req: Request) {
  const supabase = await getSupabase();

  /* ------------------------------------------------------------
     Auth (cookie-based)
  ------------------------------------------------------------ */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { ok: false, error: "unauthenticated" },
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
      { ok: false, error: "workspaceId is required" },
      { status: 400 }
    );
  }

  /* ------------------------------------------------------------
     SELECT — RLS enforced automatically
  ------------------------------------------------------------ */
  const { data, error } = await supabase
    .from("rolodex")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("rolodex select error", {
      code: error.code,
      message: error.message,
      details: error.details,
    });

    // SELECT visibility failures should degrade to empty,
    // not surface as Forbidden
    return NextResponse.json({
      ok: true,
      items: [],
    });
  }

  return NextResponse.json({
    ok: true,
    items: data ?? [],
  });
}

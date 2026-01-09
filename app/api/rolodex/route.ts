// ------------------------------------------------------------
// Rolodex API Route (AUTHORITATIVE — LOCKED)
// Matches memory.memories behavior EXACTLY
// Bearer cookie auth · RLS enforced · memory schema
// NEXT 16 SAFE
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
const DIAG = true;

/* ------------------------------------------------------------
   Supabase (schema-bound)
------------------------------------------------------------ */
async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "memory" }, // 🔥 THIS IS THE FIX
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/* ------------------------------------------------------------
   GET /api/rolodex
------------------------------------------------------------ */
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
  const q = searchParams.get("q");

  let query = supabase
    .from("rolodex")
    .select("*")
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "select.rolodex",
        error,
        ...(DIAG && { diag: { user_id: user.id } }),
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    ok: true,
    data,
    ...(DIAG && { diag: { count: data.length } }),
  });
}

/* ------------------------------------------------------------
   POST /api/rolodex
------------------------------------------------------------ */
export async function POST(req: Request) {
  const supabase = await getSupabase();

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { ok: false, error: "unauthenticated" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("rolodex")
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "insert.rolodex",
        error,
        ...(DIAG && { diag: { user_id: user.id } }),
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, data });
}

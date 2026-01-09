// ------------------------------------------------------------
// Rolodex API Route (AUTHORITATIVE — LOCKED)
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
const DIAG = true;

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
   GET /api/rolodex  (OWNER SCOPED)
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
    .eq("user_id", user.id) // 🔥 REQUIRED
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({
      ok: true,
      data: [],
      ...(DIAG && { diag: { count: 0 } }),
    });
  }

  return NextResponse.json({
    ok: true,
    data,
    ...(DIAG && { diag: { count: data.length } }),
  });
}

/* ------------------------------------------------------------
   POST /api/rolodex  (OWNER FORCED)
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
  delete body.user_id; // 🔒 CRITICAL

  const { data, error } = await supabase
    .from("rolodex")
    .insert({
      ...body,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, stage: "insert.rolodex", error },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, data });
}

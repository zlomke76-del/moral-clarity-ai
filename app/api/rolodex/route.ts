// ------------------------------------------------------------
// Rolodex API Route (AUTHORITATIVE)
// Matches memory.memories route behavior EXACTLY
// Cookie-based auth · RLS enforced · memory schema
// NEXT 16 SAFE · NODE RUNTIME
// ------------------------------------------------------------

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* ------------------------------------------------------------
   Diagnostics toggle
------------------------------------------------------------ */
const DIAG = true;

/* ------------------------------------------------------------
   Supabase helper (cookie-auth, user-scoped)
------------------------------------------------------------ */
async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/* ------------------------------------------------------------
   OPTIONS (preflight)
------------------------------------------------------------ */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://studio.moralclarity.ai",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

/* ------------------------------------------------------------
   GET /api/rolodex
------------------------------------------------------------ */
export async function GET(req: Request) {
  const supabase = await getSupabase();

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

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  let query = supabase
    .schema("memory")
    .from("rolodex")
    .select("*")
    .order("created_at", { ascending: false });

  if (q && q.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "select.rolodex",
        error,
        ...(DIAG && {
          diag: {
            schema: "memory",
            table: "rolodex",
            user_id: user.id,
          },
        }),
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    ok: true,
    data,
    ...(DIAG && {
      diag: {
        count: data?.length ?? 0,
        user_id: user.id,
      },
    }),
  });
}

/* ------------------------------------------------------------
   POST /api/rolodex
------------------------------------------------------------ */
export async function POST(req: Request) {
  const supabase = await getSupabase();

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

  const body = await req.json();

  const payload = {
    ...body,
    user_id: user.id, // 🔒 enforced server-side
  };

  const { data, error } = await supabase
    .schema("memory")
    .from("rolodex")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "insert.rolodex",
        error,
        ...(DIAG && {
          diag: {
            schema: "memory",
            table: "rolodex",
            user_id: user.id,
          },
        }),
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    ok: true,
    data,
    ...(DIAG && {
      diag: {
        inserted: true,
        id: data.id,
      },
    }),
  });
}

// ------------------------------------------------------------
// Rolodex Item API Route (AUTHORITATIVE)
// PATCH + DELETE
// Matches memory.memories item routes EXACTLY
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
   Supabase helper
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
   PATCH /api/rolodex/[id]
------------------------------------------------------------ */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

  const id = params.id;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "missing_id" },
      { status: 400 }
    );
  }

  const body = await req.json();

  // 🔒 Prevent ownership reassignment
  delete body.user_id;

  const { data, error } = await supabase
    .schema("memory")
    .from("rolodex")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "update.rolodex",
        error,
        ...(DIAG && {
          diag: {
            schema: "memory",
            table: "rolodex",
            record_id: id,
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
        updated: true,
        id: data.id,
      },
    }),
  });
}

/* ------------------------------------------------------------
   DELETE /api/rolodex/[id]
------------------------------------------------------------ */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
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

  const id = params.id;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "missing_id" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .schema("memory")
    .from("rolodex")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "delete.rolodex",
        error,
        ...(DIAG && {
          diag: {
            schema: "memory",
            table: "rolodex",
            record_id: id,
            user_id: user.id,
          },
        }),
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    ok: true,
    ...(DIAG && {
      diag: {
        deleted: true,
        id,
      },
    }),
  });
}

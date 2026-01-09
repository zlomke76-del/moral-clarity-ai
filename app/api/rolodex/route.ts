// ------------------------------------------------------------
// Rolodex API Route (AUTHORITATIVE — ID SCOPED)
// PATCH + DELETE
// Matches memory.memories route behavior EXACTLY
// Cookie-based auth · RLS enforced · memory schema
// NEXT 16 SAFE
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* ------------------------------------------------------------
   Diagnostics toggle
------------------------------------------------------------ */
const DIAG = true;

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */
async function getSupabase() {
  const cookieStore = await cookies(); // ✅ async (Next 16)

  const supabase = createServerClient(
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

  return supabase;
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

  const body = await req.json();

  const { data, error } = await supabase
    .schema("memory")
    .from("rolodex")
    .update(body)
    .eq("id", params.id)
    .eq("user_id", user.id) // 🔒 RLS alignment + safety
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
            user_id: user.id,
            rolodex_id: params.id,
            schema: "memory",
            table: "rolodex",
            role: "authenticated",
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

  const { error } = await supabase
    .schema("memory")
    .from("rolodex")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id); // 🔒 enforced

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "delete.rolodex",
        error,
        ...(DIAG && {
          diag: {
            user_id: user.id,
            rolodex_id: params.id,
            schema: "memory",
            table: "rolodex",
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
        id: params.id,
      },
    }),
  });
}

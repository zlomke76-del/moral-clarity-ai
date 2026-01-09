// ------------------------------------------------------------
// Rolodex ID Route (PATCH + DELETE)
// Cookie auth · RLS enforced · memory schema
// AUTHORITATIVE — FIXED UPDATE SEMANTICS
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

/* ------------------------------------------------------------
   Supabase (schema-bound)
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
   PATCH /api/rolodex/[id]
   OWNER FORCED · SAFE UPDATE
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
      { ok: false, error: "Rolodex ID is required" },
      { status: 400 }
    );
  }

  const body = await req.json();

  // 🔒 HARD SANITIZATION
  delete body.user_id;
  delete body.created_at;
  delete body.updated_at;

  // workspace_id may be null — DO NOT delete it conditionally
  // null is a valid value for personal contacts

  const { error } = await supabase
    .from("rolodex")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("update.rolodex error", error);
    return NextResponse.json(
      { ok: false, stage: "update.rolodex", error },
      { status: 403 }
    );
  }

  // ✅ SUCCESS EVEN IF NO ROW RETURNED
  return NextResponse.json({ ok: true });
}

/* ------------------------------------------------------------
   DELETE /api/rolodex/[id]
------------------------------------------------------------ */
export async function DELETE(
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
      { ok: false, error: "Rolodex ID is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("rolodex")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("delete.rolodex error", error);
    return NextResponse.json(
      { ok: false, stage: "delete.rolodex", error },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}

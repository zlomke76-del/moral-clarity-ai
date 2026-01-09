// ------------------------------------------------------------
// Rolodex ID Route (PATCH + DELETE)
// Cookie auth · RLS enforced · memory schema
// AUTHORITATIVE — FIXED JSON HANDLING
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
   OWNER FORCED · SAFE PAYLOAD PARSE
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

  const id = params?.id;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Rolodex ID is required" },
      { status: 400 }
    );
  }

  // ----------------------------------------------------------
  // SAFE JSON PARSE (THIS WAS THE BUG)
  // ----------------------------------------------------------
  let body: Record<string, any> = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // ----------------------------------------------------------
  // HARD SANITIZATION
  // ----------------------------------------------------------
  delete body.user_id;
  delete body.id;
  if (!body.workspace_id) delete body.workspace_id;

  // Nothing to update?
  if (Object.keys(body).length === 0) {
    return NextResponse.json(
      { ok: true, noop: true },
      { status: 200 }
    );
  }

  const { data, error } = await supabase
    .from("rolodex")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("update.rolodex error", error);
    return NextResponse.json(
      { ok: false, stage: "update.rolodex", error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, data });
}

/* ------------------------------------------------------------
   DELETE /api/rolodex/[id]
   OWNER ONLY
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

  const id = params?.id;
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
      { ok: false, stage: "delete.rolodex", error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, success: true });
}

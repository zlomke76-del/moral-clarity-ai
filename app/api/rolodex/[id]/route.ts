// ============================================================
// Rolodex Item API — PATCH / DELETE
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ========= Helpers ========= */

function getSupabase(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );
}

/* ========= PATCH ========= */
/**
 * PATCH /api/rolodex/:id
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = NextResponse.next();
  const supabase = getSupabase(req, res);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { error } = await supabase
    .schema("memory")
    .from("rolodex")
    .update({
      name: body.name,
      relationship_type: body.relationship_type ?? null,
      primary_email: body.primary_email ?? null,
      primary_phone: body.primary_phone ?? null,
      birthday: body.birthday ?? null,
      notes: body.notes ?? null,
      sensitivity_level: body.sensitivity_level ?? undefined,
      consent_level: body.consent_level ?? undefined,
    })
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/* ========= DELETE ========= */
/**
 * DELETE /api/rolodex/:id
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = NextResponse.next();
  const supabase = getSupabase(req, res);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .schema("memory")
    .from("rolodex")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// app/api/rolodex/[id]/route.ts
// ============================================================
// Rolodex API — UPDATE + DELETE
// ============================================================
// - Uses user session (cookies)
// - No service role
// - RLS enforces ownership
// - TABLE: memory.rolodex
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
 * PATCH /api/rolodex/[id]
 *
 * Body: any subset of rolodex fields (except user_id)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = new NextResponse();
  const supabase = getSupabase(req, res);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json(
      { error: "Rolodex id is required" },
      { status: 400 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Explicit allow-list (prevents accidental column writes)
  const updatePayload: Record<string, any> = {};
  const allowed = [
    "name",
    "relationship_type",
    "primary_email",
    "primary_phone",
    "birthday",
    "notes",
    "workspace_id",
    "sensitivity_level",
    "consent_level",
  ];

  for (const key of allowed) {
    if (key in body) {
      updatePayload[key] = body[key];
    }
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json(
      { error: "No updatable fields provided" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .schema("memory")
    .from("rolodex")
    .update({
      ...updatePayload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    console.error("[ROLODEX PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

/* ========= DELETE ========= */
/**
 * DELETE /api/rolodex/[id]
 *
 * - Hard delete
 * - RLS enforces ownership
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = new NextResponse();
  const supabase = getSupabase(req, res);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json(
      { error: "Rolodex id is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .schema("memory")
    .from("rolodex")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[ROLODEX DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

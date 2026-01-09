// app/api/rolodex/route.ts
// ============================================================
// Rolodex API — minimal, RLS-governed
// ============================================================
// - Uses user session (cookies)
// - No service role
// - RLS enforces ownership + isolation
// - TABLE: memory.rolodex
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   Supabase (REQUEST-SCOPED, NEXT 16 SAFE)
============================================================ */

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
        set() {
          // no-op (server components / route handlers)
        },
        remove() {
          // no-op
        },
      },
    }
  );
}

/* ============================================================
   GET /api/rolodex
   Optional: ?q=name
============================================================ */
export async function GET(req: NextRequest) {
  const supabase = await getSupabase();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  let query = supabase
    .schema("memory")
    .from("rolodex")
    .select(
      `
        id,
        name,
        relationship_type,
        primary_email,
        primary_phone,
        birthday,
        notes,
        sensitivity_level,
        consent_level,
        created_at,
        updated_at
      `
    )
    .order("name", { ascending: true });

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/* ============================================================
   POST /api/rolodex
============================================================ */
export async function POST(req: NextRequest) {
  const supabase = await getSupabase();

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

  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .schema("memory")
    .from("rolodex")
    .insert({
      user_id: user.id,
      workspace_id: body.workspace_id ?? null,
      name: body.name.trim(),
      relationship_type: body.relationship_type ?? null,
      primary_email: body.primary_email ?? null,
      primary_phone: body.primary_phone ?? null,
      birthday: body.birthday ?? null,
      notes: body.notes ?? null,
      sensitivity_level: body.sensitivity_level ?? undefined,
      consent_level: body.consent_level ?? undefined,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

/* ============================================================
   PATCH /api/rolodex?id=UUID
============================================================ */
export async function PATCH(req: NextRequest) {
  const supabase = await getSupabase();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { data, error } = await supabase
    .schema("memory")
    .from("rolodex")
    .update(body)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* ============================================================
   DELETE /api/rolodex?id=UUID
============================================================ */
export async function DELETE(req: NextRequest) {
  const supabase = await getSupabase();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase
    .schema("memory")
    .from("rolodex")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// app/api/rolodex/route.ts
// ============================================================
// Rolodex API — authoritative, RLS-governed
// ============================================================
// - Next.js 16 App Router compatible
// - Supabase SSR (cookies + response mutation safe)
// - NO service role
// - RLS enforces ownership
// - Supports GET / POST / PATCH / DELETE
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------
   Supabase factory (REQUIRED pattern)
------------------------------------------------------------ */
async function getSupabase(req: NextRequest) {
  const res = NextResponse.next();
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
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

  return { supabase, res };
}

/* ============================================================
   GET /api/rolodex
   Optional: ?q=search
============================================================ */
export async function GET(req: NextRequest) {
  const { supabase } = await getSupabase(req);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  let query = supabase
    .schema("memory")
    .from("rolodex")
    .select(`
      id,
      user_id,
      workspace_id,
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
    `)
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (q && q.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
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
  const { supabase } = await getSupabase(req);

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

  const insertPayload = {
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
  };

  const { data, error } = await supabase
    .schema("memory")
    .from("rolodex")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

/* ============================================================
   PATCH /api/rolodex?id=UUID
============================================================ */
export async function PATCH(req: NextRequest) {
  const { supabase } = await getSupabase(req);

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
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const allowedFields = [
    "name",
    "relationship_type",
    "primary_email",
    "primary_phone",
    "birthday",
    "notes",
    "sensitivity_level",
    "consent_level",
    "workspace_id",
  ];

  const updates: Record<string, any> = {};
  for (const key of allowedFields) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields provided" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .schema("memory")
    .from("rolodex")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/* ============================================================
   DELETE /api/rolodex?id=UUID
============================================================ */
export async function DELETE(req: NextRequest) {
  const { supabase } = await getSupabase(req);

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
    return NextResponse.json({ error: "id is required" }, { status: 400 });
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

  return NextResponse.json({ success: true });
}

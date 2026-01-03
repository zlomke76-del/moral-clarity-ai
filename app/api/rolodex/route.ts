// app/api/rolodex/route.ts
// ============================================================
// Rolodex API — minimal, RLS-governed
// ============================================================
// - Uses user session (cookies) via next/headers
// - No service role
// - RLS enforces ownership + isolation
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ========= Helpers ========= */

function getSupabase(res: NextResponse) {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
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
}

/* ========= GET ========= */
/**
 * GET /api/rolodex
 * GET /api/rolodex?q=char
 *
 * - Lists user's contacts
 * - Optional fuzzy name search
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = getSupabase(res);

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
    .from("rolodex")
    .select(`
      id,
      name,
      relationship_type,
      primary_email,
      primary_phone,
      notes,
      sensitivity_level,
      consent_level,
      created_at,
      updated_at
    `)
    .order("name", { ascending: true });

  if (q && q.trim().length > 0) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/* ========= POST ========= */
/**
 * POST /api/rolodex
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = getSupabase(res);

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
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
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
    .from("rolodex")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

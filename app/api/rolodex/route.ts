// ------------------------------------------------------------
// Rolodex API Route (AUTHORITATIVE)
// CRUD + Deterministic Diagnostics
// Next.js 16 App Router Compatible
// ------------------------------------------------------------

import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function isDiag(req: NextRequest) {
  return req.nextUrl.searchParams.get("diag") === "1";
}

// ------------------------------------------------------------
// Supabase factory (CORRECT for Next 16)
// ------------------------------------------------------------

async function getSupabase() {
  const cookieStore = await cookies(); // ✅ MUST await in Next 16

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
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

// ------------------------------------------------------------
// GET /api/rolodex
// ------------------------------------------------------------

export async function GET(req: NextRequest) {
  const diag: Record<string, any> = { route: "GET /rolodex" };
  const DIAG = isDiag(req);

  try {
    diag.stage = "init";

    const supabase = await getSupabase();

    diag.stage = "auth";

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    diag.auth = {
      user_present: !!user,
      user_id: user?.id ?? null,
      auth_error: authError ?? null,
    };

    if (!user) {
      return json(
        DIAG ? { ok: false, diag } : { error: "unauthorized" },
        401
      );
    }

    diag.stage = "query";

    const { data, error } = await supabase
      .from("rolodex")
      .select("*")
      .order("updated_at", { ascending: false });

    diag.query = {
      row_count: data?.length ?? 0,
      error,
    };

    if (error) throw error;

    return json(DIAG ? { ok: true, data, diag } : data);
  } catch (err) {
    diag.stage = "catch";
    diag.exception = err;

    return json(
      DIAG ? { ok: false, diag } : { error: "internal_error" },
      500
    );
  }
}

// ------------------------------------------------------------
// POST /api/rolodex
// ------------------------------------------------------------

export async function POST(req: NextRequest) {
  const diag: Record<string, any> = { route: "POST /rolodex" };
  const DIAG = isDiag(req);

  try {
    const supabase = await getSupabase();
    const body = await req.json();

    diag.stage = "auth";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    diag.user_id = user?.id ?? null;

    if (!user) return json({ error: "unauthorized" }, 401);

    diag.stage = "insert";

    const { data, error } = await supabase
      .from("rolodex")
      .insert({ ...body, user_id: user.id })
      .select()
      .single();

    diag.insert = { error };

    if (error) throw error;

    return json(DIAG ? { ok: true, data, diag } : data, 201);
  } catch (err) {
    diag.stage = "catch";
    diag.exception = err;
    return json(DIAG ? { ok: false, diag } : { error: "internal_error" }, 500);
  }
}

// ------------------------------------------------------------
// PATCH /api/rolodex
// ------------------------------------------------------------

export async function PATCH(req: NextRequest) {
  const diag: Record<string, any> = { route: "PATCH /rolodex" };
  const DIAG = isDiag(req);

  try {
    const supabase = await getSupabase();
    const body = await req.json();
    const { id, ...updates } = body;

    diag.stage = "auth";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    diag.user_id = user?.id ?? null;

    if (!user) return json({ error: "unauthorized" }, 401);
    if (!id) return json({ error: "missing_id" }, 400);

    diag.stage = "update";

    const { data, error } = await supabase
      .from("rolodex")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    diag.update = { error };

    if (error) throw error;

    return json(DIAG ? { ok: true, data, diag } : data);
  } catch (err) {
    diag.stage = "catch";
    diag.exception = err;
    return json(DIAG ? { ok: false, diag } : { error: "internal_error" }, 500);
  }
}

// ------------------------------------------------------------
// DELETE /api/rolodex?id=UUID
// ------------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const diag: Record<string, any> = { route: "DELETE /rolodex" };
  const DIAG = isDiag(req);

  try {
    const supabase = await getSupabase();
    const id = req.nextUrl.searchParams.get("id");

    diag.stage = "auth";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    diag.user_id = user?.id ?? null;

    if (!user) return json({ error: "unauthorized" }, 401);
    if (!id) return json({ error: "missing_id" }, 400);

    diag.stage = "delete";

    const { error } = await supabase
      .from("rolodex")
      .delete()
      .eq("id", id);

    diag.delete = { error };

    if (error) throw error;

    return json(DIAG ? { ok: true, diag } : { ok: true });
  } catch (err) {
    diag.stage = "catch";
    diag.exception = err;
    return json(DIAG ? { ok: false, diag } : { error: "internal_error" }, 500);
  }
}

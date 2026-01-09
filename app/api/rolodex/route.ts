// ------------------------------------------------------------
// Rolodex API Route (AUTHORITATIVE)
// Table: memory.rolodex
// Auth: Cookie-based Supabase (RLS enforced)
// Runtime: Next.js 16 (cookies() is async)
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type Diag = {
  stage: string;
  ok: boolean;
  detail?: any;
};

function diagFail(stage: string, detail: any, status = 500) {
  console.error("[ROLodex][FAIL]", stage, detail);
  return NextResponse.json(
    { ok: false, stage, detail },
    { status }
  );
}

function diagOk(stage: string, detail?: any): Diag {
  return { stage, ok: true, detail };
}

/* ------------------------------------------------------------
   Supabase Server Client (Next 16 SAFE)
------------------------------------------------------------ */
async function getSupabase() {
  const cookieStore = await cookies(); // 🔑 REQUIRED IN NEXT 16

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
   GET /api/rolodex?q=
------------------------------------------------------------ */
export async function GET(req: Request) {
  const diag: Diag[] = [];

  try {
    const supabase = await getSupabase();
    diag.push(diagOk("supabase_client_created"));

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return diagFail(
        "auth.getUser",
        userErr ?? "No user session",
        401
      );
    }

    diag.push(diagOk("auth_user", { user_id: user.id }));

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    let query = supabase
      .from("rolodex")
      .select("*")
      .order("updated_at", { ascending: false });

    if (q) {
      query = query.ilike("name", `%${q}%`);
      diag.push(diagOk("query_filter", q));
    }

    const { data, error } = await query;

    if (error) {
      return diagFail("select.rolodex", error, 403);
    }

    diag.push(diagOk("rows_returned", data.length));

    return NextResponse.json({
      ok: true,
      diag,
      data,
    });
  } catch (e: any) {
    return diagFail("unhandled_exception", e?.message ?? e);
  }
}

/* ------------------------------------------------------------
   POST /api/rolodex
------------------------------------------------------------ */
export async function POST(req: Request) {
  try {
    const supabase = await getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return diagFail("auth", "No session", 401);
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from("rolodex")
      .insert({
        ...body,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return diagFail("insert.rolodex", error, 403);
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return diagFail("post_exception", e?.message ?? e);
  }
}

/* ------------------------------------------------------------
   PATCH /api/rolodex/[id]
------------------------------------------------------------ */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return diagFail("auth", "No session", 401);
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from("rolodex")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return diagFail("update.rolodex", error, 403);
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return diagFail("patch_exception", e?.message ?? e);
  }
}

/* ------------------------------------------------------------
   DELETE /api/rolodex/[id]
------------------------------------------------------------ */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return diagFail("auth", "No session", 401);
    }

    const { error } = await supabase
      .from("rolodex")
      .delete()
      .eq("id", params.id);

    if (error) {
      return diagFail("delete.rolodex", error, 403);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return diagFail("delete_exception", e?.message ?? e);
  }
}

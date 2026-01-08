import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

function createSupabase(req: Request, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookieHeader = req.headers.get("cookie") ?? "";
          const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
          return match?.[1];
        },
        set(name, value, options) {
          response.cookies.set(name, value, options);
        },
        remove(name, options) {
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}

/* ---------------------------------------------------------
   GET — Fetch factual memories (authoritative source)
--------------------------------------------------------- */
export async function GET(req: Request) {
  const response = NextResponse.json({});

  try {
    const supabase = createSupabase(req, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("memories")
      .select(
        `
        id,
        workspace_id,
        memory_type,
        fact_type,
        content,
        confidence,
        priority,
        is_authoritative,
        source,
        created_at,
        updated_at
        `
      )
      .eq("user_id", user.id)
      .eq("memory_type", "factual")
      .order("priority", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      count: data.length,
      memories: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

/* ---------------------------------------------------------
   PATCH — Edit an existing factual memory (in place)
--------------------------------------------------------- */
export async function PATCH(req: Request) {
  const response = NextResponse.json({});

  try {
    const supabase = createSupabase(req, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, content, confidence, priority } = body;

    if (!id || typeof content !== "string") {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("memories")
      .update({
        content,
        confidence,
        priority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .eq("memory_type", "factual");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

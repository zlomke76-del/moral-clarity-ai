// app/api/rolodex/route.ts
// ------------------------------------------------------------
// Rolodex API (AUTHORITATIVE)
// CRUD access to memory.rolodex
// Assumes RLS policies already exist and are correct
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */

function json(
  body: unknown,
  status: number = 200
) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

async function requireUser(supabase: ReturnType<typeof createServerClient>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/* ------------------------------------------------------------------
   GET — list rolodex entries
------------------------------------------------------------------- */

export async function GET() {
  try {
    const supabase = await getSupabase();
    const user = await requireUser(supabase);

    if (!user) {
      return json({ error: "unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("rolodex")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return json(
        { error: "rolodex_select_failed", details: error.message },
        403
      );
    }

    return json({ data });
  } catch (err) {
    console.error("[rolodex][GET]", err);
    return json({ error: "internal_error" }, 500);
  }
}

/* ------------------------------------------------------------------
   POST — create new rolodex entry
------------------------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const supabase = await getSupabase();
    const user = await requireUser(supabase);

    if (!user) {
      return json({ error: "unauthorized" }, 401);
    }

    const payload = await req.json();

    const insert = {
      ...payload,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("rolodex")
      .insert(insert)
      .select()
      .single();

    if (error) {
      return json(
        { error: "rolodex_insert_failed", details: error.message },
        403
      );
    }

    return json({ data }, 201);
  } catch (err) {
    console.error("[rolodex][POST]", err);
    return json({ error: "internal_error" }, 500);
  }
}

/* ------------------------------------------------------------------
   PATCH — update existing rolodex entry
------------------------------------------------------------------- */

export async function PATCH(req: Request) {
  try {
    const supabase = await getSupabase();
    const user = await requireUser(supabase);

    if (!user) {
      return json({ error: "unauthorized" }, 401);
    }

    const payload = await req.json();
    const { id, ...updates } = payload;

    if (!id) {
      return json({ error: "missing_id" }, 400);
    }

    const { data, error } = await supabase
      .from("rolodex")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return json(
        { error: "rolodex_update_failed", details: error.message },
        403
      );
    }

    return json({ data });
  } catch (err) {
    console.error("[rolodex][PATCH]", err);
    return json({ error: "internal_error" }, 500);
  }
}

/* ------------------------------------------------------------------
   DELETE — hard delete rolodex entry
------------------------------------------------------------------- */

export async function DELETE(req: Request) {
  try {
    const supabase = await getSupabase();
    const user = await requireUser(supabase);

    if (!user) {
      return json({ error: "unauthorized" }, 401);
    }

    const { id } = await req.json();

    if (!id) {
      return json({ error: "missing_id" }, 400);
    }

    const { error } = await supabase
      .from("rolodex")
      .delete()
      .eq("id", id);

    if (error) {
      return json(
        { error: "rolodex_delete_failed", details: error.message },
        403
      );
    }

    return json({ success: true });
  } catch (err) {
    console.error("[rolodex][DELETE]", err);
    return json({ error: "internal_error" }, 500);
  }
}

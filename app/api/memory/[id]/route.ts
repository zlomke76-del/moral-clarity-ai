// app/api/memory/[id]/route.ts
// ------------------------------------------------------------
// Memory ID Route (PATCH + DELETE)
// Explicit URL parsing · Bearer auth · RLS enforced
// AUTHORITATIVE — DO NOT TRUST params
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */
function extractIdFromUrl(req: Request): string | null {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    return id || null;
  } catch {
    return null;
  }
}

function getBearerToken(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.replace("Bearer ", "").trim();
}

/* ------------------------------------------------------------
   PATCH /api/memory/[id]
------------------------------------------------------------ */
export async function PATCH(req: Request) {
  /* ----------------------------------------------------------
     Resolve ID (authoritative)
  ---------------------------------------------------------- */
  const memoryId = extractIdFromUrl(req);
  if (!memoryId) {
    return NextResponse.json(
      { error: "Memory ID is required" },
      { status: 400 }
    );
  }

  /* ----------------------------------------------------------
     Auth
  ---------------------------------------------------------- */
  const accessToken = getBearerToken(req);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  /* ----------------------------------------------------------
     Supabase client (RLS enforced)
  ---------------------------------------------------------- */
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  /* ----------------------------------------------------------
     Parse body (explicit content only)
  ---------------------------------------------------------- */
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  if (!("content" in body)) {
    return NextResponse.json(
      { error: "content is required" },
      { status: 400 }
    );
  }

  /* ----------------------------------------------------------
     Update (ownership enforced by RLS + WHERE)
  ---------------------------------------------------------- */
  const { data, error } = await supabase
    .schema("memory")
    .from("memories")
    .update({
      content: body.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", memoryId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Memory not found or not owned by user" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

/* ------------------------------------------------------------
   DELETE /api/memory/[id]
------------------------------------------------------------ */
export async function DELETE(req: Request) {
  /* ----------------------------------------------------------
     Resolve ID (authoritative)
  ---------------------------------------------------------- */
  const memoryId = extractIdFromUrl(req);
  if (!memoryId) {
    return NextResponse.json(
      { error: "Memory ID is required" },
      { status: 400 }
    );
  }

  /* ----------------------------------------------------------
     Auth
  ---------------------------------------------------------- */
  const accessToken = getBearerToken(req);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  /* ----------------------------------------------------------
     Supabase client (RLS enforced)
  ---------------------------------------------------------- */
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  /* ----------------------------------------------------------
     Delete (ownership enforced)
  ---------------------------------------------------------- */
  const { error } = await supabase
    .schema("memory")
    .from("memories")
    .delete()
    .eq("id", memoryId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, deleted: true });
}

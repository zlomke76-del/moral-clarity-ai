// app/api/memory/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { remember } from "@/lib/memory";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function getUserKey(req: NextRequest) {
  const url = new URL(req.url);
  return (
    req.headers.get("x-user-key") ||
    url.searchParams.get("user_key") ||
    "guest"
  );
}

export async function GET(req: NextRequest) {
  const user_key = getUserKey(req);

  const { data, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("importance")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rows: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.content)
    return NextResponse.json({ ok: false, error: "Missing content" }, { status: 400 });

  const user_key = getUserKey(req);

  try {
    const row = await remember({
      user_key,
      content: body.content,
      title: body.title,
      purpose: body.purpose,
      workspace_id: body.workspace_id,
    });

    return NextResponse.json({ ok: true, row }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

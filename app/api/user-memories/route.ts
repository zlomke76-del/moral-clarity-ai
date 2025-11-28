// app/api/user-memories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { remember, type MemoryPurpose } from "@/lib/memory";

function sb() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase env vars missing");
  }
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

// GET /api/user-memories?user_key=...&kind=fact&search=...&limit=50&offset=0
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userKey = url.searchParams.get("user_key");
    const kind = url.searchParams.get("kind");
    const search = url.searchParams.get("search")?.trim();
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    if (!userKey) {
      return NextResponse.json(
        { error: "user_key is required" },
        { status: 400 }
      );
    }

    const client = sb();
    let query = client
      .from("user_memories")
      .select(
        `
        id,
        user_key,
        title,
        content,
        kind,
        workspace_id,
        episodic_type,
        episode_summary,
        importance,
        source,
        origin,
        created_at,
        updated_at
      `
      )
      .eq("user_key", userKey)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (kind && kind !== "all") {
      query = query.eq("kind", kind);
    }

    if (search) {
      // Simple ILIKE search on content/title; vector search still handled elsewhere.
      query = query.or(
        `content.ilike.%${search}%,title.ilike.%${search}%,episode_summary.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("[user-memories] GET error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rows: data ?? [] });
  } catch (err: any) {
    console.error("[user-memories] GET exception", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

// POST /api/user-memories
// body: { userKey, content, kind?, title?, workspaceId? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userKey: string | null = body?.userKey ?? null;
    const content: string | null = body?.content ?? null;
    const kind: MemoryPurpose = body?.kind ?? "fact";
    const title: string | null = body?.title ?? null;
    const workspaceId: string | null = body?.workspaceId ?? null;

    if (!userKey || !content?.trim()) {
      return NextResponse.json(
        { error: "userKey and content are required" },
        { status: 400 }
      );
    }

    // Reuse the existing memory engine so embeddings + classification stay coherent.
    const res = await remember({
      user_key: userKey,
      content,
      purpose: kind,
      title,
      workspace_id: workspaceId ?? undefined,
    });

    return NextResponse.json({ row: res.row, classification: res.classification });
  } catch (err: any) {
    console.error("[user-memories] POST exception", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

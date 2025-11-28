// app/api/user-memories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { remember, type MemoryPurpose } from "@/lib/memory";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userKey = user.email || user.id;
    if (!userKey) {
      return NextResponse.json(
        { error: "User has no email/id" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const kind = url.searchParams.get("kind");
    const search = url.searchParams.get("search")?.trim();
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    let query = supabase
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

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userKey = user.email || user.id;
    if (!userKey) {
      return NextResponse.json(
        { error: "User has no email/id" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const content: string | null = body?.content ?? null;
    const kind: MemoryPurpose = body?.kind ?? "fact";
    const title: string | null = body?.title ?? null;
    const workspaceId: string | null = body?.workspaceId ?? null;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    // Use unified memory engine; embeddings + classification stay consistent.
    const res = await remember({
      user_key: userKey,
      content,
      purpose: kind,
      title,
      workspace_id: workspaceId ?? undefined,
    });

    return NextResponse.json({
      row: res.row,
      classification: res.classification,
    });
  } catch (err: any) {
    console.error("[user-memories] POST exception", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

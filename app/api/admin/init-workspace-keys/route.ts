/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { initWorkspaceKey } from "@/server/memory-utils";

export const runtime = "nodejs";

/** Create a server-side Supabase client (service key preferred) */
function getAdminSupabase(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** POST { workspaceId?: string } -> { ok, ref } */
export async function POST(request: Request) {
  try {
    const supa = getAdminSupabase();
    const body = (await request.json().catch(() => ({}))) as {
      workspaceId?: string;
    };

    const workspaceId =
      body.workspaceId || process.env.MCA_WORKSPACE_ID || "diagnostic";

    if (!workspaceId) {
      return NextResponse.json(
        { ok: false, error: "workspaceId is required" },
        { status: 400 },
      );
    }

    const ref = await initWorkspaceKey(supa, workspaceId);
    return NextResponse.json({ ok: true, ref });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}

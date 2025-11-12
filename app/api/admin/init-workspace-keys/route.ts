// app/api/admin/init-workspace-keys/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { initWorkspaceKey } from "../../../../server/memory-utils";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../../types/supabase";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Supabase env not configured");
  return createClient<Database>(url, key, { db: { schema: "mca" } });
}

/**
 * Initialize (or fetch) the per-workspace encryption key.
 * Accepts workspaceId via JSON body { workspaceId } or search param ?workspaceId=
 */
export async function POST(req: Request) {
  try {
    const supabase = getAdminSupabase();

    const contentType = req.headers.get("content-type") || "";
    let workspaceId: string | undefined;

    if (contentType.includes("application/json")) {
      const body = (await req.json()) ?? {};
      workspaceId = body.workspaceId || body.workspace_id;
    } else {
      const url = new URL(req.url);
      workspaceId = url.searchParams.get("workspaceId") ?? undefined;
    }

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
    }

    const ref = await initWorkspaceKey(supabase, workspaceId);
    return NextResponse.json({ ok: true, ...ref });
  } catch (err: any) {
    console.error("[init-workspace-keys] error:", err?.message ?? err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "init error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}

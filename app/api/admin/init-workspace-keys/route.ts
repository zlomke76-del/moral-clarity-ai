import { NextRequest } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { initWorkspaceKey } from "@/lib/memory-utils";
import type { Database } from "@/types/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badAuth() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Typed client; cast to reach mca schema tables without fighting generics
const supa: SupabaseClient<Database> = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const mca = () => (supa as unknown as SupabaseClient<any>).schema("mca");

export async function OPTIONS() { return new Response(null, { status: 204 }); }
export async function GET() { return json({ ok: true, route: "init-workspace-keys" }, 200); }

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (!token || token !== process.env.ADMIN_TASKS_TOKEN) return badAuth();

  let workspaceId: string | undefined;
  try { workspaceId = (await req.json())?.workspaceId; } catch {}

  try {
    if (workspaceId) {
      const keyRef = await initWorkspaceKey(supa, workspaceId);
      return json({ initialized: [workspaceId], keyRef }, 201);
    }

    // Initialize keys for all workspaces missing entries
    const { data: workspaces, error: wsErr } = await mca().from("workspaces").select("id");
    if (wsErr) throw wsErr;

    const { data: haveKeys, error: hkErr } = await mca()
      .from("workspace_keys")
      .select("workspace_id");
    if (hkErr) throw hkErr;

    const have = new Set((haveKeys ?? []).map((r: any) => r.workspace_id));
    const targets = (workspaces ?? [])
      .map((w: any) => w.id)
      .filter((id: string) => !have.has(id));

    const initialized: string[] = [];
    for (const id of targets) {
      await initWorkspaceKey(supa, id);
      initialized.push(id);
    }
    return json({ initialized, count: initialized.length }, 201);
  } catch (e: any) {
    console.error("init-workspace-keys error:", e);
    return json({ error: e?.message ?? String(e) }, 500);
  }
}

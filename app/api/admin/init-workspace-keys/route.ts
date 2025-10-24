// app/api/admin/init-workspace-keys/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { initWorkspaceKey } from "@/server/memory-utils";

// Ensure Node runtime (not Edge) for crypto + service role
export const runtime = "nodejs";
// Force this to run server-side every call
export const dynamic = "force-dynamic";

function badAuth() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// OPTIONS for good CORS hygiene
export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

// Simple existence check (should return 200 OK if deployed)
export async function GET() {
  return json({ ok: true, route: "init-workspace-keys" }, 200);
}

// The actual initializer
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (!token || token !== process.env.ADMIN_TASKS_TOKEN) return badAuth();

  let workspaceId: string | undefined;
  try {
    const body = await req.json();
    workspaceId = body?.workspaceId;
  } catch {
    // allow empty body
  }

  try {
    if (workspaceId) {
      const keyRef = await initWorkspaceKey(supa, workspaceId);
      return json({ initialized: [workspaceId], keyRef }, 201);
    }

    // init all missing
    const { data: workspaces, error: wsErr } = await supa
      .from("mca.workspaces")
      .select("id");
    if (wsErr) throw wsErr;

    const { data: haveKeys, error: hkErr } = await supa
      .from("mca.workspace_keys")
      .select("workspace_id");
    if (hkErr) throw hkErr;

    const have = new Set((haveKeys ?? []).map((r) => r.workspace_id));
    const targets = (workspaces ?? []).map((w) => w.id).filter((id) => !have.has(id));

    const initialized: string[] = [];
    for (const id of targets) {
      await initWorkspaceKey(supa, id);
      initialized.push(id);
    }
    return json({ initialized, count: initialized.length }, 201);
  } catch (e: any) {
    return json({ error: e?.message ?? String(e) }, 500);
  }
}

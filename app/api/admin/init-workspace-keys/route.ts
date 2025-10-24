import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { initWorkspaceKey } from "@/server/memory-utils";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Protect with a simple bearer token
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (token !== process.env.ADMIN_TASKS_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workspaceId } = await req.json().catch(() => ({}));

  try {
    if (workspaceId) {
      // init a single workspace
      const keyRef = await initWorkspaceKey(supa, workspaceId);
      return NextResponse.json({ initialized: [workspaceId], keyRef });
    } else {
      // init ALL missing keys
      const { data: workspaces, error } = await supa
        .from("mca.workspaces")
        .select("id");
      if (error) throw error;

      const { data: haveKeys } = await supa
        .from("mca.workspace_keys")
        .select("workspace_id");

      const have = new Set((haveKeys || []).map((r) => r.workspace_id));
      const targets = (workspaces || []).map((w) => w.id).filter((id) => !have.has(id));

      const initialized: string[] = [];
      for (const id of targets) {
        await initWorkspaceKey(supa, id);
        initialized.push(id);
      }
      return NextResponse.json({ initialized, count: initialized.length });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}

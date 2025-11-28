// lib/workspaces.ts
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export async function resolveOrCreateWorkspace() {
  const supabase = createSupabaseBrowser();

  // 1. Load session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("No active session");
  const userId = session.user.id;

  // 2. Find existing workspace membership
  const { data: memberships, error: memErr } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("user_id", userId);

  if (memErr) {
    console.error("workspace_members lookup error", memErr);
    throw memErr;
  }

  if (memberships?.length > 0) {
    // Already has workspace
    return memberships[0].workspace_id;
  }

  // 3. No workspace? Create one
  const { data: ws, error: wsErr } = await supabase
    .from("workspaces")
    .insert({})
    .select("id")
    .single();

  if (wsErr) {
    console.error("workspace creation failed", wsErr);
    throw wsErr;
  }

  const workspaceId = ws.id;

  // 4. Create membership
  const { error: memInsertErr } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      role: "owner",
    });

  if (memInsertErr) {
    console.error("workspace_members insert failed", memInsertErr);
    throw memInsertErr;
  }

  return workspaceId;
}

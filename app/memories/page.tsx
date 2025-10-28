// Server component that routes the user to their primary workspace’s memory page.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

export default async function MemoriesIndex() {
  const cookieStore = await cookies();

  const supa = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => cookieStore.get(key)?.value,
      },
    }
  );

  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    // Adjust to your login route
    redirect("/login");
  }

  // Find a personal workspace for this user (or any membership)
  const { data: owned } = await supa
    .schema("mca")
    .from("workspaces")
    .select("id")
    .eq("owner_uid", user!.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (owned?.id) {
    redirect(`/w/${owned.id}/memory`);
  }

  // If not owner, try membership
  const { data: member } = await supa
    .schema("mca")
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_uid", user!.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (member?.workspace_id) {
    redirect(`/w/${member.workspace_id}/memory`);
  }

  // Fallback: keep user on a friendly screen
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Memories</h1>
      <p className="opacity-70">
        You don’t have a workspace yet. Use the admin tool to create one.
      </p>
    </div>
  );
}

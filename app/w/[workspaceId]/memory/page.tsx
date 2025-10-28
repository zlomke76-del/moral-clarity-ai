// Server component that renders the current workspace’s memory list.
// Uses @supabase/ssr so auth cookies work on the server.

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

type Params = { params: { workspaceId: string } };

export default async function MemoryPage({ params }: Params) {
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

  // Optional: confirm user session (redirect if you want)
  const {
    data: { user },
  } = await supa.auth.getUser();

  // Load recent memories for this workspace
  const { data: memories, error } = await supa
    .schema("mca")
    .from("memories")
    .select("id,title,created_at")
    .eq("workspace_id", params.workspaceId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Memory</h1>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Memory</h1>
        {user && (
          <span className="text-sm opacity-70">
            signed in as {user.email ?? user.id}
          </span>
        )}
      </div>

      {!memories || memories.length === 0 ? (
        <p className="opacity-70">No memories yet.</p>
      ) : (
        <ul className="space-y-2">
          {memories.map((m) => (
            <li
              key={m.id}
              className="rounded-lg border px-4 py-3 shadow-sm"
            >
              <div className="font-medium">{m.title ?? m.id}</div>
              <div className="text-xs opacity-60">
                {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

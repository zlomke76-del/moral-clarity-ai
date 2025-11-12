// app/memories/page.tsx
// Server component: redirects user to their first workspace’s memory page
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { listWorkspacesForUser } from "@/lib/mca-rest";

// Force Node runtime so Supabase SSR libs don't trip Edge warnings
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function MemoriesLanding() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Match your actual login route used elsewhere in the app
    redirect("/auth/sign-in");
  }

  // Keep type safe & not inferred as never[]
  type WorkspacesReturn = Awaited<ReturnType<typeof listWorkspacesForUser>>;
  let workspaces: WorkspacesReturn = [];

  try {
    workspaces = await listWorkspacesForUser(user.id);
  } catch {
    // ignore; fall through
  }

  const targetWsId = (workspaces as any[])[0]?.id as string | undefined;
  if (!targetWsId) {
    redirect("/welcome");
  }

  redirect(`/w/${targetWsId}/memory`);
}

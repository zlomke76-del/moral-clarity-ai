// app/memories/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { listWorkspacesForUser } from "@/lib/mcai-rest";

export const dynamic = "force-dynamic";

export default async function MemoriesLanding() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Ensure [] isn't inferred as never[]
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

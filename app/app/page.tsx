// app/app/page.tsx
import { getSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AppHome() {
  const supabase = getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/sign-in?next=%2Fapp");
  }

  // ... then run your Six Blocks queries and render
}

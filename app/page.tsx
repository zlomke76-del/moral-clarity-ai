// app/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function IndexPage() {
  const supabase = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/app");
  } else {
    redirect("/auth/sign-in");
  }
}

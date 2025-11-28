// app/memories/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import MemoriesClient from "./MemoriesClient";

export default async function MemoriesPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // No authenticated user: force login
    redirect("/auth/sign-in");
  }

  const userKey = user.email || user.id;
  if (!userKey) {
    // Should basically never happen, but be defensive
    redirect("/auth/sign-in");
  }

  return <MemoriesClient userKey={userKey} />;
}


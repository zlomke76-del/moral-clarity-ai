import { headers } from "next/headers";
import { createClientServer } from "@/lib/supabase/server";

export async function canonicalUserKey() {
  const hdr = await headers();
  const cookieHeader = hdr.get("cookie") ?? "";

  const supabase = createClientServer(cookieHeader);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  return session.user.id;
}

// /lib/canonicalUserKey.ts
// ------------------------------------------------------------
// Stable identity resolver for MCAI (Next.js 16 safe)
// ------------------------------------------------------------

import { headers } from "next/headers";
import { createClientServer } from "./supabase/server";

export async function getCanonicalUserKey(): Promise<string> {
  // headers() is ASYNC in Next.js 16 → must await it
  const hdr = await headers();
  const cookieHeader = hdr.get("cookie") ?? "";

  // Create SSR client using safe cookie-header injection
  const supabase = createClientServer(cookieHeader);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user?.id) {
    return session.user.id;
  }

  return "guest";
}

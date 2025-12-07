// lib/supabase/edge-user.ts
// -------------------------------------------------------------
// Extract authenticated Supabase user inside an Edge Function
// Works with Next.js middleware + magic link cookies
// -------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";

export async function getEdgeUser(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map((c) => c.trim().split("="))
        .map(([k, ...v]) => [k, v.join("=")])
    );

    const accessToken = cookies["sb-access-token"] ?? null;
    const refreshToken = cookies["sb-refresh-token"] ?? null;

    if (!accessToken) {
      return null; // Not logged in
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // NOT service key!
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) return null;

    return {
      email: data.user.email ?? null,
      id: data.user.id ?? null,
    };
  } catch (err) {
    console.error("[edge-user] failed:", err);
    return null;
  }
}

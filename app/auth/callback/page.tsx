// app/auth/callback/page.tsx
export const runtime = "nodejs"; // Must be "nodejs" in Next 16

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export default async function AuthCallbackPage() {
  // ⬅️ FIX: cookies() returns a Promise in Next 16
  const cookieStore = await cookies();

  const raw = cookieStore.get("auth-callback-search")?.value ?? "";
  const search = new URLSearchParams(raw);

  const code = search.get("code");
  const next = search.get("next") || "/app";

  if (!code) {
    redirect("/auth/error?err=Missing%20code");
  }

  // Supabase SSR client for NodeJS runtime
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {
          /* Supabase sets cookies via headers */
        },
        remove() {}
      }
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("PKCE Exchange Error:", error);
    redirect("/auth/error?err=Auth%20session%20failed");
  }

  redirect(next);
}


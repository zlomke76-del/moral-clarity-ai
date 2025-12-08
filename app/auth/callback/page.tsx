// app/auth/callback/page.tsx
export const runtime = "nodejs"; // REQUIRED — cannot run in Edge

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export default async function AuthCallbackPage() {
  const cookieStore = cookies();

  const search = new URLSearchParams(
    cookieStore.get("auth-callback-search")?.value ?? ""
  );

  const code = search.get("code");
  const next = search.get("next") || "/app";

  if (!code) {
    redirect("/auth/error?err=Missing%20code");
  }

  // Build the Supabase SSR client for NodeJS runtime
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // cookie write handled internally by Supabase
        },
        remove() {
          // cookie removal handled internally
        }
      }
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase PKCE Error:", error);
    redirect("/auth/error?err=Auth%20session%20failed");
  }

  redirect(next);
}

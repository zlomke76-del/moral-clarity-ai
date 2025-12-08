// app/auth/callback/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export default async function AuthCallbackPage() {
  // ⬅️ FIX: cookies() must be awaited in Next 16
  const cookieStore = await cookies();

  const raw = cookieStore.get("auth-callback-search")?.value ?? "";
  const search = new URLSearchParams(raw);

  const code = search.get("code");
  const next = search.get("next") || "/app";

  if (!code) {
    redirect(`/auth/error?err=Missing%20code`);
  }

  // Supabase SSR client with cookie adapter
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },

        set(name: string, value: string, options?: CookieOptions) {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        },

        remove(name: string, options?: CookieOptions) {
          cookieStore.set({
            name,
            value: "",
            maxAge: 0,
            ...options,
          });
        },
      },
    }
  );

  // Exchange PKCE code for session cookie
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    redirect(`/auth/error?err=Auth%20session%20failed`);
  }

  redirect(next);
}

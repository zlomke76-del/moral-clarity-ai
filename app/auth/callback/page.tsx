// app/auth/callback/page.tsx
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";

export default async function Callback({
  searchParams,
}: {
  searchParams: { code?: string; next?: string };
}) {
  const code = searchParams.code;
  const next = searchParams.next || "/app";

  if (!code) {
    redirect("/auth/error?err=MissingCode");
  }

  // Server-side Supabase client, cookie-aware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Exchange the PKCE code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirect("/auth/error?err=ExchangeFailed");
  }

  // Supabase automatically wrote sb-access-token + sb-refresh-token cookies
  redirect(next);
}

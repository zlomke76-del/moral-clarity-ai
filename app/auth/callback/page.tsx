// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center text-slate-100">
      <CallbackInner />
    </main>
  );
}

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Let Supabase hydrate the session cookie
      await supabase.auth.getSession();
      if (cancelled) return;

      // ✅ Default to "/" if no or bad next param
      const rawNext = searchParams.get("next");
      const next =
        rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
          ? rawNext
          : "/";

      router.replace(next);
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams, supabase]);

  return (
    <p className="text-sm text-slate-300">
      Signing you in with your magic link…
    </p>
  );
}

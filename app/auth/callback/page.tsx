// app/auth/callback/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

// 🔧 Tell Next.js not to prerender this page
export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center text-slate-100">
      <Suspense fallback={<p className="text-sm text-slate-300">Signing you in…</p>}>
        <CallbackInner />
      </Suspense>
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
      // hydrate Supabase auth state
      await supabase.auth.getSession();
      if (cancelled) return;

      // Safely read `next` param, default to "/"
      const rawNext = searchParams?.get("next") ?? null;

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


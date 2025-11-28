"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

/**
 * Inner component that can use useSearchParams (wrapped in Suspense below).
 */
function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Instantiate the browser client so it processes the URL tokens.
      const supabase = createSupabaseBrowser();

      try {
        // This triggers Supabase's implicit flow handling of the URL.
        // If it throws, we just log it and still try to move on.
        await supabase.auth.getSession();
      } catch (err) {
        console.error("[auth/callback] getSession error (ignored)", err);
      }

      if (!cancelled) {
        const next = params?.get("next") || "/";
        router.replace(next);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [router, params]);

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-black text-white">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 p-6 bg-black/40">
        <h1 className="text-xl font-semibold mb-4">Completing sign-in…</h1>
        <p className="text-sm text-neutral-300">
          Please wait a moment while we confirm your session.
        </p>
      </div>
    </main>
  );
}

/**
 * Exported page with Suspense wrapper so useSearchParams is legal in app router.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center p-6 bg-black text-white">
          <div className="w-full max-w-md rounded-xl border border-neutral-800 p-6 bg-black/40">
            <h1 className="text-xl font-semibold mb-4">Completing sign-in…</h1>
          </div>
        </main>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}



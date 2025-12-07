// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

// 🚀 CRITICAL: prevent prerendering so useSearchParams is valid
export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowser();

      // safe — hook always returns an object at runtime
      const params = searchParams!;
      const code = params.get("code");
      const next = params.get("next") || "/app";

      if (!code) {
        return router.replace("/auth/error?err=Missing%20code");
      }

      // Exchange Supabase magic-link code for session & cookies
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data?.session) {
        return router.replace("/auth/error?err=Failed%20to%20exchange%20code");
      }

      // success → redirect user into Studio
      return router.replace(next);
    };

    run();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <p>Signing you in…</p>
    </div>
  );
}

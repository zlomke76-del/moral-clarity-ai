// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // TS thinks nullable, but it's always defined

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowser();

      // ✅ FIX: explicitly coerce searchParams as non-null
      const params = searchParams!;

      const code = params.get("code");
      const next = params.get("next") || "/app";

      if (!code) {
        return router.replace("/auth/error?err=Missing%20code");
      }

      // 🔥 REQUIRED: exchange magic-link code for a session & cookies
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data?.session) {
        return router.replace("/auth/error?err=Failed%20to%20exchange%20code");
      }

      // Cookies now exist: sb-access-token, sb-refresh-token
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

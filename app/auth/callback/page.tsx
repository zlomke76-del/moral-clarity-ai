// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowser();

      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/app";

      if (!code) {
        return router.replace("/auth/error?err=Missing%20code");
      }

      // 🔥 THE CRITICAL STEP: EXCHANGE THE MAGIC LINK CODE
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data?.session) {
        return router.replace(
          "/auth/error?err=Failed%20to%20exchange%20code"
        );
      }

      // At this point Supabase writes:
      // - sb-access-token
      // - sb-refresh-token
      // correctly via browser client settings

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

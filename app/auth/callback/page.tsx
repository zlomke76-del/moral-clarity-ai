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
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/app";

      if (!code) {
        router.replace("/auth/error?err=Missing%20code");
        return;
      }

      const supabase = createSupabaseBrowser();

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data?.session) {
        router.replace("/auth/error?err=Code%20exchange%20failed");
        return;
      }

      router.replace(next);
    };

    run();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}

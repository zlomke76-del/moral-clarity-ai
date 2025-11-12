// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams(); // can be null in type space

  useEffect(() => {
    (async () => {
      try {
        const code = params?.get?.("code") ?? null;
        const next = params?.get?.("next") ?? "/app";

        if (code) {
          const supabase = getSupabaseBrowser();
          // Ignore “already used/invalid” — just continue to the app
          await supabase.auth.exchangeCodeForSession(code).catch(() => {});
        }

        router.replace(next);
      } catch {
        router.replace("/app");
      }
    })();
  }, [params, router]);

  return null;
}

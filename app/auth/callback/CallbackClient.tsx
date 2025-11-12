// app/auth/callback/CallbackClient.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function CallbackClient() {
  const router = useRouter();
  const params = useSearchParams(); // may be null during build/type-check paths

  useEffect(() => {
    (async () => {
      try {
        const code = params?.get("code") ?? null;
        const next = params?.get("next") ?? "/app";

        if (code) {
          const supabase = getSupabaseBrowser();
          // Ignore exchange errors like "already used" – just continue
          await supabase.auth.exchangeCodeForSession(code).catch(() => {});
        }

        router.replace(next);
      } catch {
        router.replace("/app");
      }
    })();
    // It’s fine to depend on params; it’s stable for this page load.
  }, [params, router]);

  return null;
}


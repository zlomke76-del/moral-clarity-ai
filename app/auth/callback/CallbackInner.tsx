// app/auth/callback/CallbackInner.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function handle() {
      const supabase = createSupabaseBrowser();

      // This forces Supabase to inspect the URL and establish the session
      await supabase.auth.getSession();

      // TypeScript thinks params might be null; at runtime it never is,
      // but we still satisfy the type checker here.
      const search = params ?? new URLSearchParams();
      const next = search.get("next") || "/app";

      router.replace(next);
    }

    handle();
  }, [params, router]);

  return null;
}

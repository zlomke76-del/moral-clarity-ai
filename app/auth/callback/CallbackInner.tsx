// app/auth/callback/CallbackInner.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { useEffect } from "react";

export default function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function handle() {
      const supabase = createSupabaseBrowser();

      // Trigger session extraction from URL
      await supabase.auth.getSession();

      const next = params.get("next") || "/app";
      router.replace(next);
    }

    handle();
  }, [params, router]);

  return null;
}

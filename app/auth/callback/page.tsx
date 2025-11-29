// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleLogin() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // complete session
      await supabase.auth.getSession();

      // safe redirect
      const rawNext = searchParams?.get("next");

      const next =
        rawNext &&
        rawNext.startsWith("/") &&
        !rawNext.startsWith("//")
          ? rawNext
          : "/app";   // ← ALWAYS FALL BACK TO /app

      router.replace(next);
    }

    handleLogin();
  }, []);

  return null;
}


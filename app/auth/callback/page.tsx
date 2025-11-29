// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuthCallback() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Make sure Supabase finishes establishing the session
      await supabase.auth.getSession();

      // Read ?next= from the URL on the client side
      let next = "/app";

      try {
        const qs = new URLSearchParams(window.location.search);
        const rawNext = qs.get("next");

        if (
          rawNext &&
          rawNext.startsWith("/") &&
          !rawNext.startsWith("//") &&
          rawNext !== "/auth/callback"
        ) {
          next = rawNext;
        }
      } catch {
        // If anything goes wrong, just fall back to /app
        next = "/app";
      }

      router.replace(next);
    }

    handleAuthCallback();
  }, [router]);

  // Nothing to render – this page only exists to complete the login + redirect
  return null;
}



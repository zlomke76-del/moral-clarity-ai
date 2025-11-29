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

      // Ensure Supabase finishes the session handshake
      await supabase.auth.getSession();

      // Default redirect target
      let next = "/app";

      try {
        const qs = new URLSearchParams(window.location.search);
        const rawNext = qs.get("next");

        // Treat /memory as invalid (we no longer support that route)
        const isBadNext =
          !rawNext ||
          rawNext === "/memory" ||
          !rawNext.startsWith("/") ||
          rawNext.startsWith("//") ||
          rawNext === "/auth/callback";

        next = isBadNext ? "/app" : rawNext;
      } catch {
        // On any parsing error, just go to /app
        next = "/app";
      }

      router.replace(next);
    }

    handleAuthCallback();
  }, [router]);

  return null;
}


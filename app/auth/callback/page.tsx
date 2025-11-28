"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function processCallback() {
      const supabase = createSupabaseBrowser();

      // Ensure the client parses tokens from URL first
      await supabase.auth.getSession();

      // URLSearchParams is never null
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/app";

      router.replace(next);
    }

    processCallback();
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center text-white">
      <p>Finishing sign-in…</p>
    </main>
  );
}



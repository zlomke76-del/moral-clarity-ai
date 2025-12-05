"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createSupabaseBrowser();

      // IMPORTANT: this forces Supabase to parse the URL code
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        router.replace(
          "/auth/error?err=" +
            encodeURIComponent(error.message || "Auth callback failed")
        );
        return;
      }

      if (!data.session) {
        // Try explicitly exchanging code for session
        const { data: exchanged, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(window.location.href);

        if (exchangeError || !exchanged?.session) {
          router.replace(
            "/auth/error?err=" +
              encodeURIComponent(
                "Auth callback failed: no session could be established. Please request a new magic link."
              )
          );
          return;
        }

        // If exchange works → redirect to /app
        router.replace("/app");
        return;
      }

      // Normal successful path
      router.replace("/app");
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}

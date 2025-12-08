"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowser();

      try {
        // After middleware reroutes ?code=... → this page,
        // Supabase will have already exchanged the session
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          return router.replace("/auth/error?err=Auth%20session%20failed");
        }

        // User authenticated → go to Studio
        return router.replace("/app");
      } catch (err) {
        return router.replace(
          "/auth/error?err=Unexpected%20callback%20error"
        );
      }
    };

    run();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}


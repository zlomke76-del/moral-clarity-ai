// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const process = async () => {
      const supabase = createSupabaseBrowser();

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          return router.replace("/auth/error?err=Auth%20session%20failed");
        }

        return router.replace("/app");
      } catch {
        return router.replace("/auth/error?err=Unexpected%20callback%20error");
      }
    };

    process();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}


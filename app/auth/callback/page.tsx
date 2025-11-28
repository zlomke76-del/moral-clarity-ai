"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    async function run() {
      const supabase = createSupabaseBrowser();

      // This line causes Supabase to read the magic link fragment
      // and store the session in cookies.
      await supabase.auth.getSession();

      const next = params.get("next") || "/app";
      router.replace(next);
    }

    run();
  }, [router, params]);

  return (
    <div className="text-white p-10">
      <p>Signing you in…</p>
    </div>
  );
}


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    // 🔑 Implicit flow:
    // Supabase reads session directly from URL fragment
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth/sign-in");
        return;
      }

      router.replace("/app");
    });
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-neutral-500">Signing you in…</p>
    </main>
  );
}

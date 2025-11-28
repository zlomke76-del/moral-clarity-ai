// app/auth/callback/AuthCallbackClient.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabaseSession } from "@/app/providers/supabase-session";

export default function AuthCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { session, loading } = useSupabaseSession();

  useEffect(() => {
    if (loading) return;

    const next = params?.get("next") || "/app";

    if (session) {
      // Session established by implicit flow (detectSessionInUrl = true)
      router.replace(next);
    } else {
      // No session found – bounce back to sign-in with an error
      router.replace("/auth/sign-in?err=missing-session");
    }
  }, [loading, session, params, router]);

  return (
    <main className="min-h-screen grid place-items-center bg-black text-white">
      <div className="text-sm text-neutral-300">
        Finishing sign-in…
      </div>
    </main>
  );
}

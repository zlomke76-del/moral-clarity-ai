"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 🔑 Let Supabase consume the magic link FIRST
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          router.replace("/auth/sign-in");
          return;
        }

        const { access_token, refresh_token } = data.session;

        // Optional: exchange for httpOnly cookies
        const res = await fetch("/auth/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token, refresh_token }),
        });

        if (!res.ok) {
          router.replace("/auth/sign-in");
          return;
        }

        router.replace("/app");
      } catch {
        router.replace("/auth/sign-in");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-neutral-500">Signing you in…</p>
    </main>
  );
}

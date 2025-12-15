"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // This consumes the magic link AND persists cookies
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/auth/sign-in");
        return;
      }

      router.replace("/app");
    };

    finish();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-neutral-500">Signing you in…</p>
    </main>
  );
}

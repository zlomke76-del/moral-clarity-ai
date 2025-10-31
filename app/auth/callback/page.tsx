// app/auth/callback/page.tsx
export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"verifying" | "ok" | "error">("verifying");
  const [message, setMessage] = useState<string>("Verifying your sign-in…");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        // Exchange the OTP in the URL fragment/query for a session (handled by supabase-js)
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          setStatus("error");
          setMessage(error.message || "Could not complete sign-in.");
          return;
        }

        // If no session yet, try to parse the URL again (handles fragment)
        if (!data.session) {
          const { error: hashErr } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (hashErr) {
            setStatus("error");
            setMessage(hashErr.message || "Could not complete sign-in.");
            return;
          }
        }

        setStatus("ok");
        setMessage("Signed in. Redirecting…");

        const next = searchParams.get("next") ?? "/app";
        router.replace(next);
      } catch (e: any) {
        if (!active) return;
        setStatus("error");
        setMessage(e?.message ?? "Unexpected error during sign-in.");
      }
    })();

    return () => {
      active = false;
    };
  }, [router, searchParams, supabase]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div
        className={
          status === "error" ? "text-red-400 opacity-90" : "opacity-80"
        }
      >
        {message}
      </div>
    </main>
  );
}

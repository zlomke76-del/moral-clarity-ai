"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function CallbackShell() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"verifying" | "ok" | "error">("verifying");
  const [message, setMessage] = useState<string>("Verifying your sign-in…");

  // Tiny helpers to safely read params even if the hook is typed as nullable
  const getParam = (key: string): string | null => {
    const fromHook =
      (searchParams && "get" in searchParams ? searchParams.get(key) : null) ?? null;
    if (fromHook !== null) return fromHook;
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get(key);
    }
    return null;
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        // 1) If we already have a session, just go.
        const { data: sess0, error: err0 } = await supabase.auth.getSession();
        if (!active) return;

        if (err0) {
          setStatus("error");
          setMessage(err0.message || "Could not complete sign-in.");
          return;
        }

        // 2) If no session yet, exchange the authorization code ONLY (not the full URL).
        if (!sess0.session) {
          const code = getParam("code");
          if (!code) {
            setStatus("error");
            setMessage("Missing authorization code.");
            return;
          }

          const { data: sess1, error: err1 } =
            await supabase.auth.exchangeCodeForSession(code);

          if (!active) return;
          if (err1) {
            setStatus("error");
            setMessage(err1.message || "Could not complete sign-in.");
            return;
          }

          if (!sess1.session) {
            setStatus("error");
            setMessage("No session returned from exchange.");
            return;
          }
        }

        // 3) Success → redirect to next (defaults to /app)
        setStatus("ok");
        setMessage("Signed in. Redirecting…");
        const next = getParam("next") ?? "/app";
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
  }, [router, supabase, searchParams]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className={status === "error" ? "text-red-400 opacity-90" : "opacity-80"}>
        {message}
      </div>
    </main>
  );
}

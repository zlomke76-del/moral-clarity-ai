// components/CallbackShell.tsx
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

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        // Ensure we have a session or exchange the code from the URL
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;

        if (error) {
          setStatus("error");
          setMessage(error.message || "Could not complete sign-in.");
          return;
        }

        if (!data.session) {
          // Supabase can parse the current URL for the `code` param
          const { error: xErr } = await supabase.auth.exchangeCodeForSession(
            typeof window !== "undefined" ? window.location.href : ""
          );
          if (xErr) {
            setStatus("error");
            setMessage(xErr.message || "Could not complete sign-in.");
            return;
          }
        }

        setStatus("ok");
        setMessage("Signed in. Redirecting…");

        // Null-safe read of query param under strictNullChecks
        const next = (searchParams?.get("next") ?? "/app").toString();
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
      <div className={status === "error" ? "text-red-400 opacity-90" : "opacity-80"}>
        {message}
      </div>
    </main>
  );
}

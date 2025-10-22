// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const url = new URL(window.location.href);
      const next = url.searchParams.get("next") || "/app";
      const code = url.searchParams.get("code");
      const hash = window.location.hash || "";

      // Helper: scrub tokens from the visible URL (no page reload)
      const scrub = (to: string) => {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.hash = "";
        // keep next param for the redirecting page history, but drop tokens
        cleanUrl.searchParams.set("next", to);
        window.history.replaceState({}, "", cleanUrl.pathname + "?" + cleanUrl.searchParams.toString());
      };

      try {
        // Case 1: OTP/code flow (?code=…)
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (!error) {
            scrub(next);
            router.replace(next);
            return;
          }
          // fall through to sign-in on error
        }

        // Case 2: Hash token flow (#access_token=…&refresh_token=…)
        if (hash.includes("access_token")) {
          const params = new URLSearchParams(hash.replace(/^#/, ""));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (cancelled) return;
            if (!error) {
              scrub(next);
              router.replace(next);
              return;
            }
          }
        }

        // Nothing usable → go to sign-in (preserve desired destination)
        router.replace(`/auth?next=${encodeURIComponent(next)}`);
      } catch {
        router.replace(`/auth?next=${encodeURIComponent(next)}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-zinc-400">
      Completing sign-in…
    </div>
  );
}

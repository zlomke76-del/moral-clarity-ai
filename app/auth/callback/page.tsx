// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const url = new URL(window.location.href);
      const next = url.searchParams.get("next") || "/app";
      const code = url.searchParams.get("code");
      const hash = window.location.hash || "";

      const scrub = (to: string) => {
        const clean = new URL(window.location.href);
        clean.hash = "";
        clean.search = `?next=${encodeURIComponent(to)}`;
        window.history.replaceState({}, "", clean.pathname + clean.search);
      };

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (!error) {
            scrub(next);
            router.replace(next);
            return;
          }
        }

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

        router.replace(`/auth?next=${encodeURIComponent(next)}`);
      } catch {
        router.replace(`/auth?next=${encodeURIComponent(next)}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center text-zinc-400">
      Completing sign-in…
    </div>
  );
}

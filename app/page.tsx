"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AppHome() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase =
      typeof window === "undefined" ? null : createSupabaseBrowser();
    if (!supabase) return;

    let alive = true;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!alive) return;

        if (error) {
          router.replace("/auth?next=%2Fapp");
          return;
        }

        const session: Session | null = data.session ?? null;

        if (session) {
          // Logged in → stay on /app
          if (pathname !== "/app") router.replace("/app");
        } else {
          // Not logged in → go to auth
          router.replace("/auth?next=%2Fapp");
        }
      } catch {
        router.replace("/auth?next=%2Fapp");
      }
    })();

    return () => {
      alive = false;
    };
  }, [router, pathname]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="opacity-70">Loading…</div>
    </main>
  );
}


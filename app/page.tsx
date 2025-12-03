"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AppRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase =
      typeof window === "undefined" ? null : createSupabaseBrowser();
    if (!supabase) return;

    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;

      const session = data.session;

      if (!session) {
        router.replace("/auth?next=%2Fstudio");
        return;
      }

      router.replace("/studio");
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

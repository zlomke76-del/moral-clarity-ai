// app/page.tsx
export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function Home() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error) {
          console.warn("getSession error:", error);
          setChecked(true);
          router.replace("/auth?next=%2Fapp");
          return;
        }
        const session: Session | null = data.session ?? null;
        setChecked(true);
        router.replace(session ? "/app" : "/auth?next=%2Fapp");
      } catch (e) {
        console.warn("getSession threw:", e);
        setChecked(true);
        router.replace("/auth?next=%2Fapp");
      }
    })();

    return () => { active = false; };
    // supabase is a stable singleton; no need in deps
  }, [router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="opacity-70">{checked ? "Redirecting…" : "Loading…"}</div>
    </main>
  );
}

// app/page.tsx
export const dynamic = 'force-dynamic';
// app/page.tsx
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
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      const session: Session | null = data.session ?? null;
      setChecked(true);

      if (session) {
        router.replace("/app");
      } else {
        router.replace("/auth?next=%2Fapp");
      }
    })();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="opacity-70">{checked ? "Redirecting…" : "Loading…"}</div>
    </main>
  );
}

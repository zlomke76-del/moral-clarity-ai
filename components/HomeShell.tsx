'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function HomeShell() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase only in the browser
  useEffect(() => {
    const client = createSupabaseBrowser();
    setSupabase(client);
  }, []);

  // Once client is ready, perform auth check
  useEffect(() => {
    if (!supabase) return;
    let active = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error) throw error;

        const session: Session | null = data.session ?? null;
        router.replace(session ? "/app" : "/auth?next=%2Fapp");
      } catch {
        router.replace("/auth?next=%2Fapp");
      } finally {
        if (active) setChecked(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase, router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="opacity-70">{checked ? "Redirecting…" : "Loading…"}</div>
    </main>
  );
}

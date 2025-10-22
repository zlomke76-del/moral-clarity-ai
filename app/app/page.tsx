// app/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import FeatureGrid from "@/app/components/FeatureGrid";

export default function AppDashboard() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      const nextSession = data.session ?? null;
      setSession(nextSession);
      setLoading(false);

      // Not signed in? go to /auth and return here after login
      if (!nextSession) {
        router.replace("/auth?next=%2Fapp");
      }
    })();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  if (loading || !session) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="opacity-70">Loading…</div>
      </main>
    );
  }

  // Signed in → render the Six Blocks
  return (
    <main className="min-h-screen">
      <FeatureGrid />
    </main>
  );
}

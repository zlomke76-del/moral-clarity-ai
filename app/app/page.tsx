"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import FeatureGrid from "@/app/components/FeatureGrid";

export default function AppDashboard() {
  const supabase = createSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      // Get current session (handles magic-link cases once set)
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="opacity-70">Loading…</div>
      </main>
    );
  }

  // Not signed in → send to auth (preserve deep link back to /app)
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.replace("/auth?next=%2Fapp");
    }
    return null;
  }

  // Signed in → render the Six Blocks (FeatureGrid)
  return (
    <main className="min-h-screen">
      <FeatureGrid />
    </main>
  );
}

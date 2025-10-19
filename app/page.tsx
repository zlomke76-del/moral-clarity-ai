// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import FeatureGrid from "@/app/components/FeatureGrid";

type View = "loading" | "loggedOut" | "loggedIn";

export default function HomePage() {
  const sb = useMemo(() => createSupabaseBrowser(), []);
  const [view, setView] = useState<View>("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1) If a magic link dropped us here with a hash, set the session.
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash?.includes("access_token")) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          try {
            await sb.auth.setSession({ access_token, refresh_token });
          } catch (e) {
            console.warn("setSession failed:", e);
          } finally {
            // Clean the URL (avoid re-running on refresh)
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      }

      // 2) Decide which view to render
      const { data } = await sb.auth.getSession();
      if (!cancelled) {
        setView(data.session ? "loggedIn" : "loggedOut");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sb]);

  if (view === "loading") {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="opacity-70">Loading…</div>
      </main>
    );
  }

  if (view === "loggedIn") {
    // ✅ Authenticated view replaces the marketing hero
    return (
      <main className="min-h-screen">
        <FeatureGrid />
      </main>
    );
  }

  // ❌ Not logged in → keep your current marketing content here
  return (
    <main>
      {/* Your existing marketing hero/sections remain intact */}
      <section className="py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Anchor your decisions in clarity.</h1>
        <p className="opacity-80">AI guidance grounded in truth, neutrality, and moral clarity.</p>
      </section>

      {/* Optionally still show teaser tiles for logged-out users */}
      {/* <FeatureGrid /> */}
    </main>
  );
}

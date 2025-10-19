// app/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

// If you put FeatureGrid at app/(marketing)/_components/FeatureGrid.tsx, use this:
import FeatureGrid from "./(marketing)/_components/FeatureGrid";
// If your path is different, adjust the import accordingly:
// import FeatureGrid from "./_components/FeatureGrid";

type View = "checking" | "loggedOut" | "loggedIn";

export default function HomePage() {
  const router = useRouter();
  const [view, setView] = useState<View>("checking");

  useEffect(() => {
    const run = async () => {
      const sb = createSupabaseBrowser();
      const { data } = await sb.auth.getSession();
      setView(data.session ? "loggedIn" : "loggedOut");

      // OPTIONAL: if you’d rather move logged-in users off the marketing page entirely:
      // if (data.session) router.replace("/studio"); // <- enable if you want hard redirect
    };
    run();
  }, [router]);

  if (view === "checking") {
    // Quick, minimal skeleton while we detect session
    return (
      <main className="min-h-[60vh] grid place-items-center">
        <p className="text-sm text-zinc-400">Loading…</p>
      </main>
    );
  }

  if (view === "loggedIn") {
    // ✅ LOGGED-IN VIEW: No ads/marketing/subscribe block. Show your six-block grid.
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* Optional: a subtle greeting/header could go here */}
        <Suspense fallback={<div className="p-8 text-zinc-400">Loading…</div>}>
          <FeatureGrid />
        </Suspense>
      </main>
    );
  }

  // 🧲 LOGGED-OUT VIEW: Your existing marketing/ads/subscribe sections go here.
  // Replace the placeholders with your current components/markup.
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* === HERO / AD / MARKETING CONTENT === */}
      <section className="px-4 pt-16 pb-10 mx-auto max-w-6xl">
        {/* Example hero placeholder — replace with your current marketing content */}
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Moral Clarity AI
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Anchored answers. Neutral • Guidance • Ministry.
        </p>

        {/* Your current “Subscribe” CTA (keep for logged-out only) */}
        <div className="mt-8 flex gap-3">
          <a
            href="/subscribe"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Subscribe
          </a>
          <a
            href="/app"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold border border-zinc-700 hover:bg-zinc-900 transition"
          >
            Open the app
          </a>
        </div>
      </section>

      {/* === YOUR EXISTING AD/SECTIONS ===
          Paste your current ad blocks / testimonials / features here.
          They will NOT render when logged in.
      */}
      {/* <AdStrip /> */}
      {/* <FeatureBullets /> */}
      {/* <FAQ /> */}
    </main>
  );
}

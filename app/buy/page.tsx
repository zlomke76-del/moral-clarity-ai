"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BuyPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [ready, setReady] = useState(false); // avoid double-runs

  // LIVE price IDs
  const PRICES = useMemo(
    () => ({
      standard:  "price_1SCsmG0tWJXzci1AX3GLoTj8",
      family:    "price_1SCsmv0tWJXzci1A6hvi2Ccp",
      ministry:  "price_1SCso80tWJXzci1AoZiKFy3b",
      memory1gb: "price_1SIQry0tWJXzci1A38ftypv9",
    }),
    []
  );

  async function startCheckout(which: keyof typeof PRICES) {
    setLoading(which);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // redirect to login and come back
      const next = `/buy?plan=${encodeURIComponent(which)}`;
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, priceId: PRICES[which] }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Failed to start checkout");
  }

  // If we arrive with ?plan=..., gate on auth first; if signed in, auto-start checkout
  useEffect(() => {
    if (ready) return;
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan") as keyof typeof PRICES | null;
      if (!plan || !PRICES[plan]) { setReady(true); return; }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const next = `/buy?plan=${encodeURIComponent(plan)}`;
        window.location.href = `/login?next=${encodeURIComponent(next)}`;
        return;
      }
      await startCheckout(plan);
      setReady(true);
    })();
  }, [PRICES, ready]);

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Choose your plan</h1>
      <button onClick={() => startCheckout("standard")} disabled={!!loading}>
        {loading === "standard" ? "Redirecting…" : "Standard $25/mo"}
      </button>
      <button onClick={() => startCheckout("family")} disabled={!!loading}>
        {loading === "family" ? "Redirecting…" : "Family $50/mo"}
      </button>
      <button onClick={() => startCheckout("ministry")} disabled={!!loading}>
        {loading === "ministry" ? "Redirecting…" : "Ministry $249/mo"}
      </button>
      <button onClick={() => startCheckout("memory1gb")} disabled={!!loading}>
        {loading === "memory1gb" ? "Redirecting…" : "Add 1 GB Memory $5/mo"}
      </button>
    </div>
  );
}

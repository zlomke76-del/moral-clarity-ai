"use client";
import { useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BuyPage() {
  const [loading, setLoading] = useState<string | null>(null);

  // map friendly keys to live PRICE IDs (optional; you can also pick via UI buttons)
  const PRICES = useMemo(
    () => ({
      standard: "price_std_live_123",
      family: "price_family_live_123",
      ministry: "price_ministry_live_123",
      memory1gb: "price_memory1gb_live_123",
    }),
    []
  );

  async function startCheckout(which: keyof typeof PRICES) {
    setLoading(which);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(null);
      alert("Please sign in first.");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        priceId: PRICES[which],
        orgName: "", // optional
      }),
    });

    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Failed to start checkout");
  }

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

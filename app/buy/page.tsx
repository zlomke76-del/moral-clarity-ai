"use client";
import { useState } from "react";

export default function BuyPage() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);

    // TODO: replace with the REAL logged-in user's id from Supabase Auth
    const userId = "REPLACE_ME_WITH_SUPABASE_USER_ID";

    // TODO: replace with your real Stripe Price ID (from Stripe Dashboard)
    const priceId = "price_XXXXXXXXXXXXXX";

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        priceId,
        seats: 1,         // or user’s selection
        orgName: "My Org" // optional
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.url) {
      window.location.href = data.url; // Go to Stripe Checkout
    } else {
      alert(data.error || "Failed to start checkout");
    }
  }

  return (
    <div style={{padding: 24}}>
      <h1>Buy Pro</h1>
      <button onClick={startCheckout} disabled={loading}>
        {loading ? "Redirecting…" : "Upgrade to Pro"}
      </button>
    </div>
  );
}

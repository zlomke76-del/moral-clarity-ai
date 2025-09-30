"use client";
import { useState } from "react";

const PLANS = [
  { name: "Standard", priceText: "$25 / month", priceId: "price_1SCsmG0tWJXzci1AX3GLoTj8", blurb: "Personal use. Anchored answers and updates." },
  { name: "Family",   priceText: "$50 / month", priceId: "price_1SCsmv0tWJXzci1A6hvi2Ccp", blurb: "Families up to 5 seats, best value." },
  { name: "Pro",      priceText: "$249 / month", priceId: "price_1SCso80tWJXzci1AoZiKFy3b", blurb: "Power users, teams, and creators." }
];

export default function Page() {
  const [loading, setLoading] = useState("");

  const checkout = async (priceId) => {
    try {
      setLoading(priceId);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },   // <-- REQUIRED
        body: JSON.stringify({ priceId })                  // <-- JSON
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading("");
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Moral Clarity AI — Pricing</h1>
      {PLANS.map(p => (
        <div key={p.priceId} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>{p.name}</h2>
          <p>{p.blurb}</p>
          <strong>{p.priceText}</strong>
          <div>
            <button onClick={() => checkout(p.priceId)} disabled={loading === p.priceId} style={{ marginTop: 8 }}>
              {loading === p.priceId ? "Redirecting…" : "Subscribe"}
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}

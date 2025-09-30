// src/Pricing.jsx — v5
import React, { useState } from "react";

const PLANS = [
  {
    key: "standard",
    name: "Standard",
    priceText: "$25 / month",
    blurb: "Personal use. Anchored answers and updates.",
    priceId: "price_1SCsmG0tWJXzci1AX3GLoTj8",
    features: ["Neutral, anchored answers", "Email updates", "Basic support"],
    cta: "Subscribe",
  },
  {
    key: "family",
    name: "Family",
    priceText: "$50 / month",
    blurb: "For households or small teams — governance & audit-ready insights.",
    priceId: "price_1SCsmv0tWJXzci1A6hvi2Ccp",
    features: ["Everything in Standard", "Governance guardrails", "Audit-friendly summaries"],
    cta: "Subscribe",
    highlight: true,
  },
  {
    key: "ministry",
    name: "Ministry Plan",
    priceText: "$249 / month",
    blurb: "Tailored for ministries and congregations.",
    priceId: "price_1SCso80tWJXzci1AoZiKFy3b",
    features: [
      "Anchored analysis for pastors and boards",
      "Balanced materials for teaching",
      "Support for church governance",
      "Founding partners: coupon eligible",
    ],
    cta: "Subscribe as a ministry",
  },
];

export default function Pricing() {
  const [loadingKey, setLoadingKey] = useState("");
  const [coupon, setCoupon] = useState("");

  async function startCheckout(priceId, maybeCoupon) {
    try {
      setLoadingKey(priceId);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, coupon: maybeCoupon || null }),
      });

      // read text first to avoid “[object Object]”
      const text = await res.text();

      if (!res.ok) {
        alert(`Checkout failed (${res.status}): ${text}`);
        setLoadingKey("");
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert(`Server returned non-JSON: ${text}`);
        setLoadingKey("");
        return;
      }

      if (!data?.url) {
        alert(`No checkout URL returned: ${text}`);
        setLoadingKey("");
        return;
      }

      window.location.href = data.url;
    } catch (e) {
      console.error("Checkout error:", e);
      alert(e?.message || "Server error. Please try again.");
      setLoadingKey("");
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Pricing</h1>
        <p className="mt-3 text-slate-600">Pick a plan. Upgrade or cancel anytime in the billing portal.</p>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((p) => (
          <article
            key={p.key}
            className={
              "rounded-xl border bg-white p-6 shadow-sm flex flex-col " +
              (p.highlight ? "border-slate-900" : "border-slate-200")
            }
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-slate-600">{p.blurb}</p>
              <div className="mt-4 text-3xl font-extrabold">{p.priceText}</div>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {p.key === "ministry" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700">Have a coupon? (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. FAITH50"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    You can also enter promotion codes directly on the checkout page.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => startCheckout(p.priceId, p.key === "ministry" ? coupon.trim() : null)}
              disabled={loadingKey === p.priceId}
              className={
                "mt-6 w-full px-4 py-2 rounded-lg text-white transition " +
                (p.highlight ? "bg-slate-900 hover:bg-slate-700" : "bg-slate-800 hover:bg-slate-700") +
                " disabled:opacity-60"
              }
            >
              {loadingKey === p.priceId ? "Redirecting…" : `${p.cta} • v5`}
            </button>
          </article>
        ))}
      </section>

      <section className="mt-10 text-center text-sm text-slate-500">
        <p>
          Payments handled by Stripe. By subscribing you agree to our{" "}
          <a className="underline" href="/terms">Terms</a> and{" "}
          <a className="underline" href="/privacy">Privacy Policy</a>.
        </p>
      </section>
    </main>
  );
}

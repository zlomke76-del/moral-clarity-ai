import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// ⚡ Replace these placeholders with the real Stripe Price IDs from your dashboard
const PLANS = [
  {
    name: "Standard",
    priceText: "$25 / month",
    blurb: "Personal use. Anchored answers and updates.",
    priceId: "price_standard_id_here", 
    features: [
      "Neutral, anchored answers",
      "Email updates",
      "Basic support",
    ],
    cta: "Subscribe",
  },
  {
    name: "Family",
    priceText: "$50 / month",
    blurb: "For households or teams — governance and audit-ready insights.",
    priceId: "price_family_id_here", 
    features: [
      "Everything in Standard",
      "Governance guardrails",
      "Audit-friendly summaries",
    ],
    cta: "Subscribe",
    highlight: true,
  },
  {
    name: "Ministry Plan",
    priceText: "$249 / month",
    blurb: "Tailored for ministries and congregations.",
    priceId: "price_ministry_id_here", 
    features: [
      "Anchored analysis for pastors and boards",
      "Balanced materials for teaching",
      "Support for church governance",
      "Founding partners: 50% off with coupon",
    ],
    cta: "Subscribe as a ministry",
  },
];

export default function Pricing() {
  const handleCheckout = async (priceId) => {
    const stripe = await stripePromise;
    if (!stripe) return alert("Stripe failed to load. Please refresh.");
    await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      successUrl: "https://www.moralclarityai.com/success",
      cancelUrl: "https://www.moralclarityai.com/cancel",
    });
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Pricing</h1>
        <p className="mt-3 text-slate-600">
          Pick a plan. Upgrade or cancel anytime in the billing portal.
        </p>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
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
            </div>

            <button
              onClick={() => handleCheckout(p.priceId)}
              className={
                "mt-6 w-full px-4 py-2 rounded-lg text-white " +
                (p.highlight
                  ? "bg-slate-900 hover:bg-slate-700"
                  : "bg-slate-800 hover:bg-slate-700")
              }
            >
              {p.cta}
            </button>
          </div>
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

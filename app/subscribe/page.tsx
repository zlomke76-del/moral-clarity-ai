// app/subscribe/page.tsx
import Stripe from "stripe";
import { StartCheckoutButton, ManageBillingButton } from "../components/CheckoutButtons";

export const dynamic = "force-dynamic";

type Tier = {
  key: "standard" | "family" | "ministry";
  title: string;
  blurb: string;
  priceId: string;
};

const TIERS: Tier[] = [
  {
    key: "standard",
    title: "Standard",
    blurb: "Great for individuals.",
    priceId: process.env.PRICE_STANDARD_ID!, // e.g. price_123
  },
  {
    key: "family",
    title: "Family",
    blurb: "Up to 5 seats, shared access.",
    priceId: process.env.PRICE_FAMILY_ID!, // e.g. price_456
  },
  {
    key: "ministry",
    title: "Ministry / Enterprise",
    blurb: "Unlimited members + advanced controls.",
    priceId: process.env.PRICE_MINISTRY_ID!, // e.g. price_789
  },
];

function currency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function SubscribePage() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Pull live price details from Stripe for display (amount, interval, currency)
  const prices = await Promise.all(
    TIERS.map(async (t) => {
      const p = await stripe.prices.retrieve(t.priceId);
      const unit = (p.unit_amount ?? 0) / 100;
      const interval = p.recurring?.interval ?? "month";
      const curr = p.currency?.toUpperCase() ?? "USD";
      return {
        ...t,
        displayPrice: currency(unit, curr),
        interval,
        _curr: curr,
      };
    })
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>Choose your plan</h1>
        <p style={{ marginTop: 8, color: "#bfbfbf" }}>
          Pricing and intervals shown below are fetched live from Stripe.
        </p>

        <section
          style={{
            marginTop: 28,
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {prices.map((tier) => (
            <div
              key={tier.key}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <h3 style={{ fontSize: 22, margin: 0 }}>{tier.title}</h3>
              <p style={{ marginTop: 6, color: "#cfcfcf" }}>{tier.blurb}</p>

              <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
                {tier.displayPrice}
                <span style={{ fontSize: 14, opacity: 0.7, marginLeft: 6 }}>
                  /{tier.interval}
                </span>
              </div>

              <ul style={{ margin: "16px 0 20px", paddingLeft: 18, color: "#ddd", lineHeight: 1.6 }}>
                {tier.key === "standard" && (
                  <>
                    <li>Core features</li>
                    <li>Single user</li>
                  </>
                )}
                {tier.key === "family" && (
                  <>
                    <li>Everything in Standard</li>
                    <li>Up to 5 seats</li>
                  </>
                )}
                {tier.key === "ministry" && (
                  <>
                    <li>Unlimited members</li>
                    <li>Advanced tools & support</li>
                  </>
                )}
              </ul>

              <StartCheckoutButton priceId={tier.priceId} label={`Start ${tier.title}`} />
            </div>
          ))}
        </section>

        <div style={{ marginTop: 28 }}>
          <ManageBillingButton />
          <span style={{ marginLeft: 12, fontSize: 12, color: "#9aa0a6" }}>
            You can manage or cancel anytime.
          </span>
        </div>
      </div>
    </main>
  );
}

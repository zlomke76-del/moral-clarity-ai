// app/subscribe/page.tsx
"use client"; // <-- must be first

// A simple, embed-friendly pricing page that calls your Checkout + Portal routes

export const dynamic = "force-dynamic";

function Card({
  title,
  price,
  features,
  cta,
  onClick,
}: {
  title: string;
  price: string;
  features: string[];
  cta: string;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
        width: "100%",
        maxWidth: 420,
      }}
    >
      <h3 style={{ fontSize: 22, margin: 0, color: "#fff" }}>{title}</h3>
      <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8, color: "#fff" }}>
        {price}
        <span style={{ fontSize: 14, opacity: 0.7, marginLeft: 4 }}>/mo</span>
      </div>
      <ul style={{ margin: "16px 0 20px", paddingLeft: 18, color: "#ddd", lineHeight: 1.6 }}>
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "#0ea5e9",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {cta}
      </button>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        width: "100%",
        display: "grid",
        gap: 24,
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      }}
    >
      {children}
    </section>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
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
          Upgrade with Stripe Checkout. You can manage or cancel anytime.
        </p>

        {children}

        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <ManageBillingButton />
          <SmallNote />
        </div>
      </div>
    </main>
  );
}

/** ---------- Client actions ---------- */

async function startCheckout(priceId: string) {
  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        priceId,
        successUrl: `${window.location.origin}/subscribe?success=1`,
        cancelUrl: `${window.location.origin}/subscribe?canceled=1`,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Checkout failed");
    if (json?.url) window.location.href = json.url;
  } catch (e: any) {
    alert(e?.message ?? "Could not start checkout.");
    console.error("[checkout]", e);
  }
}

function ManageBillingButton() {
  const onClick = async () => {
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ returnUrl: `${window.location.origin}/subscribe` }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Portal error");
      if (json?.url) window.location.href = json.url;
    } catch (e: any) {
      alert(e?.message ?? "Could not open billing portal.");
      console.error("[portal]", e);
    }
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      Manage billing
    </button>
  );
}

function SmallNote() {
  return (
    <span style={{ fontSize: 12, color: "#9aa0a6" }}>
      Tip: you’ll link to an existing customer automatically if the user has one.
    </span>
  );
}

/** ---------- Page ---------- */
export default function SubscribePage() {
  // Replace with your real Stripe Price IDs
  const PRICE_STARTER = process.env.NEXT_PUBLIC_PRICE_STARTER_ID || "price_xxx_starter";
  const PRICE_PRO = process.env.NEXT_PUBLIC_PRICE_PRO_ID || "price_xxx_pro";

  return (
    <Shell>
      <div style={{ height: 24 }} />
      <Section>
        <Card
          title="Starter"
          price="$9"
          features={["Core features", "1 user", "Community support"]}
          cta="Start Starter"
          onClick={() => startCheckout(PRICE_STARTER)}
        />
        <Card
          title="Pro"
          price="$19"
          features={["Everything in Starter", "Priority support", "Early features"]}
          cta="Start Pro"
          onClick={() => startCheckout(PRICE_PRO)}
        />
      </Section>
    </Shell>
  );
}

// components/CheckoutButtons.tsx
"use client";

type StartProps = { priceId: string; label?: string };

export function StartCheckoutButton({ priceId, label = "Start" }: StartProps) {
  const onClick = async () => {
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
      window.location.href = json.url;
    } catch (e: any) {
      alert(e?.message ?? "Could not start checkout.");
      console.error("[checkout]", e);
    }
  };

  return (
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
      {label}
    </button>
  );
}

export function ManageBillingButton() {
  const onClick = async () => {
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ returnUrl: `${window.location.origin}/subscribe` }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Portal error");
      window.location.href = json.url;
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

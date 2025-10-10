// app/components/CheckoutButtons.tsx
"use client";

type StartProps = { priceId: string; label?: string };

export function StartCheckoutButton({ priceId, label = "Start" }: StartProps) {
  const onClick = async () => {
    try {
      // Build absolute return URLs. Prefer your Webflow site if provided.
      const base =
        (process.env.NEXT_PUBLIC_RETURN_URL || "").replace(/\/+$/, "") ||
        window.location.origin;

      const successUrl = `${base}?checkout=success`;
      const cancelUrl  = `${base}?checkout=canceled`;

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ priceId, successUrl, cancelUrl }),
      });

      const json = await res.json();

      if (!res.ok || !json?.url) {
        // Show server error if available; otherwise a generic message.
        alert(json?.error || "Could not start checkout.");
        return;
      }

      const url: string = json.url;

      // ✅ Prefer top-level navigation (breaks out of iframe; avoids popup blockers)
      try {
        window.top!.location.href = url;
        return;
      } catch (_) {}

      // Fallback: same-frame navigation
      try {
        window.location.href = url;
        return;
      } catch (_) {}

      // Last-resort fallback: programmatic anchor click
      const a = document.createElement("a");
      a.href = url;
      a.target = "_top";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e: any) {
      alert(e?.message ?? "Checkout failed.");
    }
  };

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,.15)",
        background: "#11a6ff",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export function ManageBillingButton() {
  const onClick = () => {
    // Replace with your billing portal link when you wire it
    alert("Billing portal coming soon.");
  };
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,.15)",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      Manage billing
    </button>
  );
}

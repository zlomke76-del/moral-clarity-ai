// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = { id: string; email?: string | null } | null;

export default function Home() {
  const [user, setUser] = useState<User>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load current user (if signed in)
    const load = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
      } catch (e: any) {
        // If auth isn’t set up yet, just ignore
        setUser(null);
      }
    };
    load();
  }, []);

  const startCheckout = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ?? null, // passes through to webhook metadata
          seats: 1,                  // keep 1 for single-user; you can change later
          orgName: null,             // optional
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to start checkout.");
      }

      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        throw new Error("Missing checkout URL from server.");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#141417",
          border: "1px solid #2b2b30",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <header style={{ marginBottom: "1rem" }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Moral Clarity AI</h1>
          <p style={{ marginTop: 4, opacity: 0.75 }}>
            If you can see this page, the app is deployed. Use the Upgrade button
            to start Stripe Checkout (server-side).
          </p>
        </header>

        <section
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={startCheckout}
            disabled={busy}
            style={{
              background: "#5c7cfa",
              color: "white",
              border: 0,
              padding: "10px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {busy ? "Starting Checkout..." : "Upgrade to Pro"}
          </button>

          {user ? (
            <span style={{ opacity: 0.8 }}>Signed in as {user.email ?? user.id}</span>
          ) : (
            <span style={{ opacity: 0.6 }}>
              Not signed in (Checkout still works; webhook will attach if/when we have your
              user id.)
            </span>
          )}
        </section>

        {error ? (
          <div
            style={{
              background: "#2b1e1e",
              border: "1px solid #6f3b3b",
              color: "#ffdede",
              padding: "10px 12px",
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        ) : null}

        <hr style={{ borderColor: "#2b2b30", margin: "16px 0" }} />

        <div style={{ opacity: 0.8, fontSize: 14 }}>
          <p style={{ marginTop: 0 }}>
            Backend API route lives at <code>/api/chat</code>. Stripe Checkout is
            started via <code>/api/stripe/checkout</code>.
          </p>
          <p style={{ marginBottom: 0 }}>
            Once payment completes, your webhook mirrors data into Supabase and flips access
            automatically (the memory/pro logic we set up).
          </p>
        </div>
      </div>
    </main>
  );
}

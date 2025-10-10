// app/cancel/page.tsx
export default function CancelPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0b0b",
        color: "#fff",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18,
          padding: "48px 36px",
          textAlign: "center",
          maxWidth: 520,
          boxShadow: "0 0 30px rgba(0,0,0,0.25)",
        }}
      >
        <img
          src="/mca-logo.svg"
          alt="Moral Clarity AI"
          style={{ width: 64, marginBottom: 16, opacity: 0.9 }}
        />

        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Checkout Cancelled</h1>
        <p style={{ opacity: 0.85, fontSize: 16, lineHeight: 1.6 }}>
          No worries — your card was not charged.  
          You can return to <strong>Moral Clarity AI</strong> anytime to complete your subscription.
        </p>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <a
            href="/subscribe"
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              background: "#5c7cfa",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background .2s",
            }}
          >
            Return to Plans
          </a>

          <a
            href="/"
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Back Home
          </a>
        </div>

        <p style={{ marginTop: 32, opacity: 0.5, fontSize: 12 }}>
          “Decisions with conscience, clarity, and calm.”  
          — The Moral Clarity AI Team
        </p>
      </div>
    </main>
  );
}

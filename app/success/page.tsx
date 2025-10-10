// app/success/page.tsx
export default function SuccessPage() {
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
          borderRadius: 16,
          padding: "40px 32px",
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>✅ Checkout Successful</h1>
        <p style={{ opacity: 0.8 }}>
          Thank you for joining <strong>Moral Clarity AI</strong>.  
          Your subscription is now active. You may close this window or return to the app.
        </p>
        <a
          href="/subscribe"
          style={{
            marginTop: 20,
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: 8,
            background: "#5c7cfa",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Return to Dashboard
        </a>
      </div>
    </main>
  );
}

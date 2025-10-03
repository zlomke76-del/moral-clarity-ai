export const metadata = {
  title: "Subscribed • Moral Clarity AI",
};

export default function SubscribeThanksPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: "#0a1220",
        color: "#f6f7fb",
        padding: "2rem",
      }}
    >
      <section
        style={{
          maxWidth: 640,
          width: "100%",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.06)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          padding: "2.5rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.6rem" }}>
          Thanks — you’re on the list!
        </h1>
        <p style={{ marginTop: ".5rem", opacity: 0.9 }}>
          We’ll be in touch soon with updates from <strong>Moral Clarity AI</strong>.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: ".7rem 1rem",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 600,
            background: "#ffd15c",
            color: "#1b1f2a",
          }}
        >
          Back to site
        </a>
      </section>
    </main>
  );
}

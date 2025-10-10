// app/embed/page.tsx
export const dynamic = "force-dynamic";

export default function EmbedPage() {
  return (
    <main style={{
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      color: "white", background: "black",
      display: "grid", placeItems: "center", minHeight: "100vh"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Moral Clarity AI</h1>
        <p style={{ opacity: 0.85 }}>Embed page is working.</p>
      </div>
    </main>
  );
}

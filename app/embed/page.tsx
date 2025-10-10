// app/embed/page.tsx
export const dynamic = "force-dynamic";
export default function EmbedPage() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#0b0b0b",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
    }}>
      <h1 style={{ fontSize: 28 }}>Moral Clarity AI — Embed test</h1>
    </main>
  );
}

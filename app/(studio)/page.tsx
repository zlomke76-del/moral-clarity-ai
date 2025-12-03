// app/(studio)/page.tsx
export const runtime = "nodejs";

export default function StudioHome() {
  // Solace + Neural Sidebar are global via layout.tsx.
  // The page intentionally stays empty.
  return (
    <div className="min-h-screen" />
  );
}

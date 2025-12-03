// app/(studio)/page.tsx
export const runtime = "nodejs";

export default function StudioHome() {
  // SolaceDock + NeuralSidebar are mounted globally in app/layout.tsx.
  // This page intentionally stays empty so the left sidebar + Solace
  // are the only UI visible on the Studio surface.

  return (
    <div className="min-h-screen" />
  );
}

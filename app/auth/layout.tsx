import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">
        {/* Layer 1 — Global Cinematic Background */}
        <div className="mc-bg-1" />
        <div className="mc-noise" />

        {/* Layer 2 — Page Content */}
        <main className="mc-content">
          {children}
        </main>
      </body>
    </html>
  );
}

// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import SolaceDock from "./components/SolaceDock";

export const metadata = {
  title: "Moral Clarity AI",
  description: "Solace — Anchored AI guidance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-slate-50 antialiased">
        {/* Clean root: no header, no sidebars, no workspace tiles */}
        <main className="min-h-screen">{children}</main>

        {/* Solace dock stays globally available */}
        <SolaceDock />
      </body>
    </html>
  );
}

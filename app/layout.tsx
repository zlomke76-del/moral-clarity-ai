// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Moral Clarity AI",
  description: "Solace — anchored AI guidance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* mc-root class is where we hang the background images */}
      <body className="mc-root text-slate-50 antialiased">
        <div className="min-h-screen w-full flex">
          {children}
        </div>
      </body>
    </html>
  );
}

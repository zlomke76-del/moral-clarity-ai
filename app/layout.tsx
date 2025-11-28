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
      <body className="bg-[#020617] text-slate-50 antialiased min-h-screen w-full">
        {/* Let NeuralShell own positioning / overflow */}
        <div className="min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  );
}

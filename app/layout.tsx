import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moral Clarity AI",
  description: "Solace — anchored AI guidance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-slate-50 antialiased min-h-screen w-full overflow-hidden">
        <div className="relative min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  );
}

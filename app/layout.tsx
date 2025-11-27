import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moral Clarity AI",
  description: "Solace — anchored AI guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#020617] text-slate-50 antialiased">
        {/* No wrapper div. NeuralShell becomes the true root frame. */}
        {children}
      </body>
    </html>
  );
}

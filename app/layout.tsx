// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Moral Clarity AI",
  description: "Solace — Anchored AI guidance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-slate-50">
        {/* Clean root — no header, no nav, no old workspace links */}
        {children}
      </body>
    </html>
  );
}



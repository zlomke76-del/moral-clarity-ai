// app/layout.tsx
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface text-text">
        <nav className="flex justify-between items-center px-6 py-3 border-b border-border bg-panel">
          <Link href="/" className="font-semibold text-lg tracking-tight">Moral Clarity AI</Link>
          <div className="flex gap-5 text-sm">
            <Link href="/ethos" className="hover:underline">Ethos</Link>
            <Link href="/help" className="hover:underline">Help</Link>
            <Link href="/support" className="hover:underline">Support</Link>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-panel px-6 py-6 text-sm text-muted flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Use</Link>
            <Link href="/aup" className="hover:underline">Acceptable Use</Link>
          </div>
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} Moral Clarity AI · All rights reserved
          </div>
        </footer>
      </body>
    </html>
  );
}

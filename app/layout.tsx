// app/layout.tsx
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutShell from "./LayoutShell";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">
        {/* Background system */}
        <div className="mc-bg pointer-events-none absolute inset-0 z-0" />
        <div className="mc-noise pointer-events-none absolute inset-0 z-0" />

        {/* Global Providers */}
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}



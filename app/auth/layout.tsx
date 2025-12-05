// app/auth/layout.tsx
"use client";

import "../globals.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* Background */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        {/* AUTH PAGE WITHOUT SIDEBAR */}
        <div className="relative w-full h-full">
          {children}
        </div>

      </body>
    </html>
  );
}

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">
        <div className="min-h-screen flex items-center justify-center p-6">
          {children}
        </div>
      </body>
    </html>
  );
}

// app/auth/layout.tsx
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  // This is a *section* layout only; RootLayout still provides <html>/<body>.
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}

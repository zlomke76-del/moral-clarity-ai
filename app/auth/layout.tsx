// app/auth/layout.tsx
"use client";

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 z-auth">
      {children}
    </div>
  );
}

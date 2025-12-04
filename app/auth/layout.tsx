// app/auth/layout.tsx
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex items-center justify-center py-20">
      {children}
    </div>
  );
}

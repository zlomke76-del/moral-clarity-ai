import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="z-auth w-full min-h-screen flex items-center justify-center px-4">
      {children}
    </div>
  );
}

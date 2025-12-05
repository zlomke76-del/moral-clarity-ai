// app/auth/layout.tsx
"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-24">
      {children}
    </div>
  );
}

// app/auth/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell w-full max-w-md mx-auto mt-24 mb-32 px-6">
      {children}
    </div>
  );
}

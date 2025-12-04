// app/auth/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* REQUIRED — this is what renders /auth/sign-in */}
        <div className="auth-wrapper min-h-screen flex items-center justify-center p-6">
          {children}
        </div>

      </body>
    </html>
  );
}

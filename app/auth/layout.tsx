// app/auth/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        {children}
      </body>
    </html>
  );
}

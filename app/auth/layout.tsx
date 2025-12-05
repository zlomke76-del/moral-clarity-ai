// app/auth/layout.tsx
export const metadata = {
  title: "Sign In — Moral Clarity AI",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Let LayoutShell control the chrome (sidebar, background, centering).
  // Auth routes only supply the inner content.
  return children;
}

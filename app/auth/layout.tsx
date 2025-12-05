// app/auth/layout.tsx
import LayoutShell from "../LayoutShell";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutShell>{children}</LayoutShell>;
}

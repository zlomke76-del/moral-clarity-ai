// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moral Clarity AI",
  description: "Decisions with conscience, clarity, and calm.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

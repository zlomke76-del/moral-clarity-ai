// app/newsroom/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "Moral Clarity Newsroom",
  description: "Solace-guided newsroom workspace",
};

export default function NewsroomLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

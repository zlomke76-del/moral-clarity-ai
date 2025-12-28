// app/w/layout.tsx

import clsx from "clsx";
import { ReactNode } from "react";

type WorkspaceLayoutProps = {
  children: ReactNode;
};

export default function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  return (
    <div
      data-app-content
      className={clsx("w-full h-full px-0 py-0")}
    >
      {children}
    </div>
  );
}

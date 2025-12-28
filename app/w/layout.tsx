// app/w/layout.tsx

import clsx from "clsx";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-app-content
      className={clsx("w-full h-full px-0 py-0")}
    >
      {children}
    </div>
  );
}

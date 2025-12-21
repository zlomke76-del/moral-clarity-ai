"use client";

import { Suspense } from "react";
import LayoutShell from "@/app/LayoutShell";
import SolaceGuard from "@/app/components/SolaceGuard";
import SolaceDockWrapper from "@/app/components/SolaceDockWrapper";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 🔒 Solace exists ONLY inside /app */}
      <Suspense fallback={null}>
        <SolaceGuard />
      </Suspense>

      <LayoutShell>{children}</LayoutShell>

      {/* 🔒 Dock is also /app-only */}
      <SolaceDockWrapper />
    </>
  );
}

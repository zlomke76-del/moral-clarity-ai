// app/components/SolaceGuard.tsx
"use client";

import { usePathname } from "next/navigation";
import SolaceDockWrapper from "./SolaceDockWrapper";

export default function SolaceGuard() {
  const pathname = usePathname();

  // --------------------------------------------------
  // 🟢 Public routes — NEVER mount Solace here
  // --------------------------------------------------
  const isPublic =
    pathname === "/pricing" ||
    pathname?.startsWith("/pricing") ||
    pathname === "/contact" ||
    pathname?.startsWith("/contact");

  if (isPublic) return null;

  // --------------------------------------------------
  // 🔓 Auth routes — no dock
  // --------------------------------------------------
  const isAuth =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/sign-in");

  if (isAuth) return null;

  // --------------------------------------------------
  // Consumer app home now owns the full Solace surface.
  // The legacy floating dock remains available on deeper app routes.
  // --------------------------------------------------
  if (pathname === "/app") return null;

  return <SolaceDockWrapper />;
}

"use client";

import { usePathname } from "next/navigation";
import SolaceDockLoader from "@/app/components/SolaceDockLoader";

export default function SolaceGuard() {
  const pathname = usePathname() || "";

  const hide =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-out");

  if (hide) return null;

  return <SolaceDockLoader />;
}

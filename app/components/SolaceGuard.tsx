"use client";

import { usePathname } from "next/navigation";
import SolaceDockLoader from "./SolaceDockLoader";

export default function SolaceGuard() {
  const path = usePathname() || "";

  const hide =
    path.startsWith("/auth") ||
    path.startsWith("/login") ||
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-out");

  if (hide) return null;
  return <SolaceDockLoader />;
}

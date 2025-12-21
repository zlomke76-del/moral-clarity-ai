"use client";

import { usePathname } from "next/navigation";
import SolaceDock from "./SolaceDock";

export default function SolaceDockWrapper() {
  const pathname = usePathname();

  // 🔒 HARD GATE: Solace ONLY exists in /app
  if (!pathname || !pathname.startsWith("/app")) {
    return null;
  }

  return <SolaceDock />;
}

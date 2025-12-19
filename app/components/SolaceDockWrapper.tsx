"use client";

import { usePathname } from "next/navigation";
import SolaceDock from "@/app/components/SolaceDock";

/**
 * SolaceDockWrapper
 *
 * HARD GUARANTEE:
 * - Solace NEVER mounts on /newsroom/*
 * - No DOM nodes
 * - No listeners
 * - No hydration artifacts
 */
export default function SolaceDockWrapper() {
  const pathname = usePathname() ?? "";

  // 🔒 Institutional / Read-Only Routes
  if (pathname.startsWith("/newsroom")) {
    return null;
  }

  return <SolaceDock />;
}

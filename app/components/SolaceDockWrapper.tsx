"use client";

import { usePathname } from "next/navigation";
import SolaceDockLoader from "./SolaceDockLoader";

export default function SolaceDockWrapper() {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/newsroom")) {
    return null;
  }

  return <SolaceDockLoader />;
}

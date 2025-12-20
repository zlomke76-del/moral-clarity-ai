"use client";

import dynamic from "next/dynamic";

/**
 * Safe client-only loader for SolaceDock.
 * SolaceDock manages its own visibility/minimize via useSolaceStore.
 * NO props. NO state duplication.
 */
const SolaceDock = dynamic(
  () => import("@/app/components/SolaceDock"),
  { ssr: false }
);

export default function SolaceDockLoader() {
  return <SolaceDock />;
}

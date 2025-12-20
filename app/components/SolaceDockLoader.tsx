"use client";

import dynamic from "next/dynamic";

/**
 * Client-only loader for SolaceDock.
 * DO NOT pass props.
 * DO NOT manage visibility here.
 * SolaceDock controls itself via useSolaceStore.
 */
const SolaceDock = dynamic(
  () => import("@/app/components/SolaceDock"),
  { ssr: false }
);

export default function SolaceDockLoader() {
  return <SolaceDock />;
}

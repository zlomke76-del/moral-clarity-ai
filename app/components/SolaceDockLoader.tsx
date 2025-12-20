"use client";

import dynamic from "next/dynamic";

/**
 * Safe client-only loader for SolaceDock.
 * Next 16: `ssr: false` must be used from a Client Component via dynamic import.
 *
 * IMPORTANT:
 * - Do NOT pass props into SolaceDock unless SolaceDock explicitly defines props.
 * - Minimize/orb behavior is controlled by SolaceDock via the Solace store (setVisible(false)).
 */
const SolaceDock = dynamic(() => import("@/app/components/SolaceDock"), {
  ssr: false,
});

export default function SolaceDockLoader() {
  return <SolaceDock />;
}

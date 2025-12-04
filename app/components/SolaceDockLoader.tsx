"use client";

import dynamic from "next/dynamic";

/**
 * Safe client-only loader for SolaceDock.
 * Required because Next.js 16 does NOT allow `ssr: false` inside a Server Component.
 */
const SolaceDock = dynamic(() => import("@/app/components/SolaceDock"), {
  ssr: false,
});

export default function SolaceDockLoader() {
  return <SolaceDock />;
}

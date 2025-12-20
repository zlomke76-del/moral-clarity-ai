"use client";

import dynamic from "next/dynamic";

const SolaceDock = dynamic(
  () => import("@/app/components/SolaceDock"),
  { ssr: false }
);

export default function SolaceDockLoader() {
  return <SolaceDock />;
}

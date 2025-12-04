"use client";

import dynamic from "next/dynamic";

const SolaceDock = dynamic(() => import("./SolaceDock"), {
  ssr: false,
});

export default function SolaceDockLoader() {
  return <SolaceDock />;
}

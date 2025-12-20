"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";

/**
 * SolaceDockLoader
 *
 * AUTHORITATIVE VISIBILITY CONTROLLER
 * ----------------------------------
 * - Owns minimized state
 * - Owns yellow orb restore control
 * - SolaceDock may REQUEST minimize
 * - Loader alone decides what is mounted
 *
 * This file MUST remain simple and boring.
 */

const SolaceDock = dynamic(() => import("./SolaceDock"), {
  ssr: false,
});

export default function SolaceDockLoader() {
  const [minimized, setMinimized] = useState(false);

  const restore = useCallback(() => {
    setMinimized(false);
  }, []);

  return (
    <>
      {/* Expanded Dock */}
      {!minimized && (
        <SolaceDock
          onRequestMinimize={() => {
            setMinimized(true);
          }}
        />
      )}

      {/* Yellow Orb Restore */}
      {minimized && (
        <button
          aria-label="Restore Solace"
          onClick={restore}
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, #fde68a, #f59e0b)",
            boxShadow:
              "0 0 18px rgba(251,191,36,0.55), inset 0 0 4px rgba(255,255,255,0.35)",
            border: "none",
            cursor: "pointer",
            zIndex: 1000,
          }}
        />
      )}
    </>
  );
}

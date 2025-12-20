"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

/**
 * Client-only loader for SolaceDock.
 * Owns visibility + orb lifecycle.
 */
const SolaceDock = dynamic(() => import("@/app/components/SolaceDock"), {
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
          onRequestMinimize={() => setMinimized(true)}
        />
      )}

      {/* Yellow Orb */}
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
        >
          <span
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          />
        </button>
      )}
    </>
  );
}

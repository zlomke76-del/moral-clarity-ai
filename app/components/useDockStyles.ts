"use client";

import { useMemo } from "react";
import { UI } from "./dock-ui";
import { Skins } from "./dock-skins";

type DockStyleArgs = {
  dockW: number;
  dockH: number;
  tx: number;
  ty: number;
  invisible: boolean;
  ministryOn: boolean;
  PAD: number;
};

export function useDockStyles({
  dockW,
  dockH,
  tx,
  ty,
  invisible,
  ministryOn,
  PAD,
}: DockStyleArgs) {
  const skin = Skins.default;

  return useMemo(() => {
    const panelStyle: React.CSSProperties = {
      position: "fixed",
      left: 0,
      top: 0,
      width: dockW,
      height: dockH,
      background:
        "linear-gradient(180deg, rgba(9,16,32,0.96) 0%, rgba(7,12,24,0.985) 100%)",
      borderRadius: UI.radiusLg,
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: ministryOn
        ? "0 24px 80px rgba(0,0,0,0.42), 0 0 0 1px rgba(251,191,36,0.08), 0 0 40px rgba(251,191,36,0.08)"
        : "0 24px 80px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.02)",
      backdropFilter: "blur(12px)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      pointerEvents: invisible ? "none" : "auto",
      transform: `translate3d(${tx}px, ${ty}px, 0)`,
      opacity: invisible ? 0 : 1,
      transition: "opacity 120ms ease",
      zIndex: 60,
    };

    const transcriptStyle: React.CSSProperties = {
      flex: "1 1 auto",
      minHeight: 0,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "16px 18px 18px",
      color: UI.text,
      background:
        "linear-gradient(180deg, rgba(10,20,40,0.98) 0%, rgba(9,18,34,1) 100%)",
    };

    const textareaStyle: React.CSSProperties = {
      width: "100%",
      minHeight: 74,
      maxHeight: 190,
      resize: "none",
      padding: "12px 14px",
      borderRadius: UI.radiusMd,
      border: "1px solid rgba(255,255,255,0.10)",
      background: "rgba(255,255,255,0.04)",
      color: UI.text,
      fontSize: "15px",
      lineHeight: "1.45",
      outline: "none",
      backdropFilter: "blur(6px)",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
    };

    const composerWrapStyle: React.CSSProperties = {
      borderTop: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(10,14,24,0.92)",
      backdropFilter: "blur(12px)",
      padding: 12,
    };

    return {
      panelStyle,
      transcriptStyle,
      textareaStyle,
      composerWrapStyle,
    };
  }, [dockW, dockH, tx, ty, invisible, ministryOn, PAD, skin.panelBg, skin.border]);
}

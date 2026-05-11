// app/components/useDockStyles.ts
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

export function useDockStyles({ dockW, dockH, tx, ty, invisible, ministryOn }: DockStyleArgs) {
  const skin = Skins.default;

  return useMemo(() => {
    const panelStyle: React.CSSProperties = {
      position: "fixed",
      left: 0,
      top: 0,
      width: dockW,
      height: dockH,
      background:
        "radial-gradient(circle at 50% 0%, rgba(31, 41, 70, 0.42), transparent 38%), linear-gradient(180deg, rgba(6, 14, 27, 0.98), rgba(4, 10, 20, 0.995))",
      borderRadius: 20,
      border: "1px solid rgba(148,163,184,0.17)",
      boxShadow: ministryOn
        ? "0 24px 80px rgba(0,0,0,0.42), 0 0 0 1px rgba(251,191,36,0.12), 0 0 44px rgba(251,191,36,0.10)"
        : "0 26px 90px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.025)",
      backdropFilter: "blur(18px)",
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
      padding: "0 22px 14px",
      color: UI.text,
      background: "transparent",
    };

    const textareaStyle: React.CSSProperties = {
      width: "100%",
      minHeight: 74,
      maxHeight: 190,
      resize: "none",
      padding: "12px 14px",
      borderRadius: 18,
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
      borderTop: "0",
      background: "transparent",
      backdropFilter: "none",
      padding: "10px 22px 22px",
    };

    return { panelStyle, transcriptStyle, textareaStyle, composerWrapStyle };
  }, [dockW, dockH, tx, ty, invisible, ministryOn, skin.panelBg, skin.border]);
}

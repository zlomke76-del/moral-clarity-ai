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
      left: PAD,
      top: PAD,
      width: dockW,
      height: dockH,
      background: skin.panelBg,
      borderRadius: UI.radiusLg,
      border: skin.border,
      boxShadow: ministryOn ? UI.glowOn : UI.shadow,
      backdropFilter: "blur(8px)",
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
      overflow: "auto",
      padding: "14px 16px",
      color: UI.text,
      background:
        "linear-gradient(180deg, rgba(12,19,30,.9), rgba(10,17,28,.92))",
    };

    const textareaStyle: React.CSSProperties = {
      width: "100%",
      minHeight: 70,
      maxHeight: 180,
      resize: "none",
      padding: "10px 12px",
      borderRadius: UI.radiusMd,
      border: UI.border,
      background: UI.surface2,
      color: UI.text,
      fontSize: "15px",
      lineHeight: "1.4",
      outline: "none",
    };

    const composerWrapStyle: React.CSSProperties = {
      borderTop: UI.edge,
      background: UI.surface1,
      padding: 10,
    };

    return {
      panelStyle,
      transcriptStyle,
      textareaStyle,
      composerWrapStyle,
    };
  }, [
    dockW,
    dockH,
    tx,
    ty,
    invisible,
    ministryOn,
    PAD,
    skin.panelBg,
    skin.border,
  ]);
}

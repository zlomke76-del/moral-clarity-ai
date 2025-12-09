"use client";

import { useEffect, useRef, useState } from "react";

const SIZE_KEY = "solace:size:v1";

export function useDockSize() {
  const [dockW, setDockW] = useState(760);
  const [dockH, setDockH] = useState(560);

  // Load saved size
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIZE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s?.w && s?.h) {
        setDockW(s.w);
        setDockH(s.h);
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(SIZE_KEY, JSON.stringify({ w: dockW, h: dockH }));
    } catch {}
  }, [dockW, dockH]);

  return { dockW, dockH, setDockW, setDockH };
}

/* ---------------------------------------------------------
   Resize handle component
--------------------------------------------------------- */
export function ResizeHandle({
  onResizeStart,
}: {
  onResizeStart: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onMouseDown={onResizeStart}
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 18,
        height: 18,
        cursor: "nwse-resize",
        background: "transparent",
        zIndex: 9999,
      }}
    />
  );
}

/* ---------------------------------------------------------
   Creates the mousemove resizing logic for the parent
--------------------------------------------------------- */
export function createResizeController(
  dockW: number,
  dockH: number,
  setDockW: (v: number) => void,
  setDockH: (v: number) => void
) {
  return function startResize(e: React.MouseEvent) {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = dockW;
    const startH = dockH;

    function onMove(ev: MouseEvent) {
      const newW = Math.max(480, startW + (ev.clientX - startX));
      const newH = Math.max(380, startH + (ev.clientY - startY));
      setDockW(newW);
      setDockH(newH);
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };
}

"use client";

import { useEffect, useRef, useState } from "react";

type Args = {
  canRender: boolean;
  visible: boolean;
  viewport: { w: number; h: number };
  panelW: number;
  panelH: number;
  isMobile: boolean;
  PAD: number;
  posKey: string;
  x: number;
  y: number;
  setPos: (x: number, y: number) => void;
};

export function useDockPosition({
  canRender,
  visible,
  viewport,
  panelW,
  panelH,
  isMobile,
  PAD,
  posKey,
  x,
  y,
  setPos,
}: Args) {
  const [dragging, setDragging] = useState(false);
  const [posReady, setPosReady] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);

  // --------------------------------------------------
  // Load saved position
  // --------------------------------------------------
  useEffect(() => {
    if (!canRender || !visible) return;
    if (viewport.w === 0 || viewport.h === 0) return;

    if (viewport.w <= 768) {
      setPosReady(true);
      return;
    }

    try {
      const raw = localStorage.getItem(posKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) {
          setPos(
            Math.max(PAD, Math.min(viewport.w - panelW - PAD, saved.x)),
            Math.max(PAD, Math.min(viewport.h - panelH - PAD, saved.y))
          );
          setPosReady(true);
          return;
        }
      }
    } catch {}

    setPos(
      Math.round((viewport.w - 760) / 2),
      Math.round((viewport.h - 560) / 2)
    );
    setPosReady(true);
  }, [canRender, visible, viewport.w, viewport.h, panelW, panelH, setPos]);

  // --------------------------------------------------
  // Persist position
  // --------------------------------------------------
  useEffect(() => {
    if (dragging) return;
    if (!posReady) return;
    if (viewport.w <= 768) return;

    try {
      localStorage.setItem(posKey, JSON.stringify({ x, y }));
    } catch {}
  }, [dragging, posReady, x, y, viewport.w]);

  // --------------------------------------------------
  // Drag handlers
  // --------------------------------------------------
  function onHeaderMouseDown(e: React.MouseEvent) {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    setOffset({
      dx: e.clientX - (rect?.left ?? 0),
      dy: e.clientY - (rect?.top ?? 0),
    });
    setDragging(true);
  }

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) =>
      setPos(e.clientX - offset.dx, e.clientY - offset.dy);
    const onUp = () => setDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, offset.dx, offset.dy, setPos]);

  return {
    containerRef,
    posReady,
    dragging,
    onHeaderMouseDown,
  };
}

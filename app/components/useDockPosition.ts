"use client";

import { useEffect, useRef, useState } from "react";

type Args = {
  canRender?: boolean;
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
  minDragPx?: number;
};

export function useDockPosition({
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
  minDragPx = 0,
}: Args) {
  const [dragging, setDragging] = useState(false);
  const [posReady, setPosReady] = useState(false);
  const [dragActivated, setDragActivated] = useState(false);

  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) return;
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
      Math.max(PAD, Math.round((viewport.w - panelW) / 2)),
      Math.max(PAD, Math.round((viewport.h - panelH) / 2))
    );
    setPosReady(true);
  }, [visible, viewport.w, viewport.h, panelW, panelH, PAD, posKey, setPos]);

  useEffect(() => {
    if (dragging) return;
    if (!posReady) return;
    if (viewport.w <= 768) return;

    const clampedX = Math.max(PAD, Math.min(viewport.w - panelW - PAD, x));
    const clampedY = Math.max(PAD, Math.min(viewport.h - panelH - PAD, y));

    if (clampedX !== x || clampedY !== y) {
      setPos(clampedX, clampedY);
      return;
    }

    try {
      localStorage.setItem(posKey, JSON.stringify({ x: clampedX, y: clampedY }));
    } catch {}
  }, [dragging, posReady, x, y, viewport.w, viewport.h, panelW, panelH, PAD, posKey, setPos]);

  function onHeaderMouseDown(e: React.MouseEvent) {
    if (isMobile) return;

    const rect = containerRef.current?.getBoundingClientRect();

    setOffset({
      dx: e.clientX - (rect?.left ?? 0),
      dy: e.clientY - (rect?.top ?? 0),
    });

    startPosRef.current = { x: e.clientX, y: e.clientY };

    setDragActivated(false);
    setDragging(true);
  }

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      if (!dragActivated) {
        const dx = Math.abs(e.clientX - startPosRef.current.x);
        const dy = Math.abs(e.clientY - startPosRef.current.y);

        if (dx < minDragPx && dy < minDragPx) {
          return;
        }

        setDragActivated(true);
      }

      const nextX = Math.max(PAD, Math.min(viewport.w - panelW - PAD, e.clientX - offset.dx));
      const nextY = Math.max(PAD, Math.min(viewport.h - panelH - PAD, e.clientY - offset.dy));

      setPos(nextX, nextY);
    };

    const onUp = () => {
      setDragging(false);
      setDragActivated(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [
    dragging,
    dragActivated,
    offset.dx,
    offset.dy,
    setPos,
    minDragPx,
    viewport.w,
    viewport.h,
    panelW,
    panelH,
    PAD,
  ]);

  return {
    containerRef,
    posReady,
    dragging,
    onHeaderMouseDown,
  };
}

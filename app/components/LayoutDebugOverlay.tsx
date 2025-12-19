// app/components/LayoutDebugOverlay.tsx
"use client";

import { useEffect, useState } from "react";

type Box = {
  label: string;
  color: string;
  selector: string;
};

const BOXES: Box[] = [
  {
    label: "APP SHELL",
    selector: "[data-app-shell]",
    color: "rgba(59,130,246,0.35)", // blue
  },
  {
    label: "NEURAL SIDEBAR",
    selector: "[data-neural-sidebar]",
    color: "rgba(34,197,94,0.35)", // green
  },
  {
    label: "APP MAIN",
    selector: "[data-app-main]",
    color: "rgba(168,85,247,0.35)", // purple
  },
  {
    label: "CONTENT COLUMN",
    selector: '[data-layout-boundary="AppContentColumn"]',
    color: "rgba(251,191,36,0.35)", // amber
  },
];

export default function LayoutDebugOverlay() {
  const [elements, setElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const found: HTMLElement[] = [];

    BOXES.forEach((box) => {
      const el = document.querySelector(box.selector);
      if (el instanceof HTMLElement) {
        found.push(el);
      }
    });

    setElements(found);
  }, []);

  return (
    <>
      {BOXES.map((box) => {
        const el = document.querySelector(box.selector) as HTMLElement | null;
        if (!el) return null;

        const rect = el.getBoundingClientRect();

        return (
          <div
            key={box.label}
            style={{
              position: "fixed",
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              border: `2px dashed ${box.color.replace("0.35", "1")}`,
              backgroundColor: box.color,
              zIndex: 999999,
              pointerEvents: "none",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                background: box.color.replace("0.35", "0.85"),
                color: "#000",
                fontSize: 12,
                fontWeight: 600,
                padding: "2px 6px",
              }}
            >
              {box.label}
            </div>
          </div>
        );
      })}
    </>
  );
}

// app/components/IframeAutoResize.tsx
"use client";

import { useEffect } from "react";

export default function IframeAutoResize() {
  useEffect(() => {
    const send = () => {
      const h =
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ) + 24; // a little padding
      try {
        window.parent?.postMessage({ type: "MCAT_IFRAME_HEIGHT", height: h }, "*");
      } catch {}
    };

    // send on load + whenever layout changes
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.documentElement);

    const mo = new MutationObserver(send);
    mo.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener("load", send);
    window.addEventListener("resize", send);

    const t = setInterval(send, 800); // catch late async changes

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("load", send);
      window.removeEventListener("resize", send);
      clearInterval(t);
    };
  }, []);

  return null;
}

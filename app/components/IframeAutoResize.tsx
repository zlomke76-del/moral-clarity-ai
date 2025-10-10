"use client";

import { useEffect } from "react";

export default function IframeAutoResize() {
  useEffect(() => {
    const send = () => {
      const h =
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        ) + 24; // a bit of padding
      // Post height to parent (Webflow)
      try {
        window.parent?.postMessage({ type: "MCAT_IFRAME_HEIGHT", height: h }, "*");
      } catch {}
    };

    // send on load + after layout shifts
    send();
    const ro = new ResizeObserver(() => send());
    ro.observe(document.documentElement);

    const mo = new MutationObserver(() => send());
    mo.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener("load", send);
    window.addEventListener("resize", send);

    const t = setInterval(send, 800); // catch dynamic content

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

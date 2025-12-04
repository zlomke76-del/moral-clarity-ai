"use client";

import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let idCounter = 1;

    const onToast = (e: any) => {
      const detail = e.detail;
      if (!detail?.text) return;

      const toast = { id: idCounter++, text: detail.text };
      setToasts((t) => [...t, toast]);

      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== toast.id));
      }, 2400);
    };

    window.addEventListener("mca:toast", onToast);
    return () => window.removeEventListener("mca:toast", onToast);
  }, []);

  return jsxs("div", {
    className:
      "fixed inset-x-0 bottom-6 z-[60] flex w-full justify-center px-4 pointer-events-none",
    children: [
      jsx("div", {
        className: "flex max-w-md flex-col gap-2",
        children: toasts.map((t) =>
          jsx(
            "div",
            {
              className:
                "pointer-events-auto rounded-md border border-neutral-800 bg-neutral-950/95 px-4 py-2 text-sm text-neutral-100 shadow-2xl animate-fade-in",
              children: t.text,
            },
            t.id
          )
        ),
      }),

      jsx("style", {
        id: "toast-anim",
        children:
          "@keyframes fade-in{0%{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in{animation:.25s ease-out fade-in}",
      }),
    ],
  });
}


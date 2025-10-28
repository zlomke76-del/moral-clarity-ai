// components/Toaster.tsx
"use client";

import { useEffect, useState } from "react";

type ToastMsg = { id: number; text: string };

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => {
    let idCounter = 1;
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<{ text: string }>).detail;
      if (!detail?.text) return;

      const toast = { id: idCounter++, text: detail.text };
      setToasts((t) => [...t, toast]);

      // Auto-dismiss after 2.4s
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== toast.id));
      }, 2400);
    };

    window.addEventListener("mca:toast", onToast as EventListener);
    return () => window.removeEventListener("mca:toast", onToast as EventListener);
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-6 z-[60] flex w-full justify-center px-4 pointer-events-none"
      aria-live="polite"
    >
      <div className="flex max-w-md flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-md border border-neutral-800 bg-neutral-950/95 
                       px-4 py-2 text-sm text-neutral-100 shadow-2xl transition

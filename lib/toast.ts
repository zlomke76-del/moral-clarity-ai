// lib/toast.ts
export function toast(text: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("mca:toast", { detail: { text } }));
}

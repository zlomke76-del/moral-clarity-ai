// app/(studio)/page.tsx
"use client";

export const runtime = "nodejs";

export default function StudioHome() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Welcome to Studio</h1>
      <p className="text-neutral-400 mt-2">
        Select a tool from the sidebar.
      </p>
    </div>
  );
}

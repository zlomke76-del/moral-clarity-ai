// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome to Moral Clarity AI
      </h1>

      <p className="text-neutral-400 max-w-lg text-center text-sm">
        You are signed in. Use the navigation above to continue.
      </p>

      <Link
        href="/workspace"
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
      >
        Go to Workspace
      </Link>
    </main>
  );
}


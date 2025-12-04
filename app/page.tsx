// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[60vh] w-full flex flex-col items-start justify-center gap-6 px-12 pt-20">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to Moral Clarity AI
      </h1>

      <p className="text-neutral-300 max-w-xl text-base">
        Use the sidebar on the left to access your workspace tools once you’ve signed in.
      </p>

      <Link
        href="/app"
        className="inline-block px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition"
      >
        Go to Studio
      </Link>
    </main>
  );
}

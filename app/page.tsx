"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold text-white mb-4">
        Welcome to Moral Clarity AI
      </h1>

      <p className="text-neutral-300 max-w-xl text-sm mb-8">
        Use the sidebar on the left to access your workspace tools once you’ve signed in.
      </p>

      <Link
        href="/app"
        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-lg"
      >
        Go to Studio
      </Link>
    </main>
  );
}

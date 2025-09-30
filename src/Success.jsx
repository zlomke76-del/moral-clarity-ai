import React from "react";

export default function Success() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">You’re in 🎉</h1>
      <p className="mt-4 text-slate-700">
        Thanks for subscribing to Moral Clarity AI. A receipt is on its way to your email.
      </p>
      <a
        href="/"
        className="inline-block mt-8 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700"
      >
        Go to homepage
      </a>
    </main>
  );
}

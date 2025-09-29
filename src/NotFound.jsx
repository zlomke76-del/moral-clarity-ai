import React from "react";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4 text-slate-700">That page drifted off course.</p>
      <a
        href="/"
        className="mt-6 inline-block px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700"
      >
        Return Home
      </a>
    </main>
  );
}

import React from "react";

export default function Cancel() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Checkout canceled</h1>
      <p className="mt-4 text-slate-700">
        No charge was made. You can try again any time.
      </p>
      <a href="/pricing" className="inline-block mt-8 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700">
        Back to pricing
      </a>
    </main>
  );
}

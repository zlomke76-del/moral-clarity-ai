// app/auth/callback/page.tsx
"use client";

import { Suspense } from "react";
import CallbackInner from "./CallbackInner";

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Signing you in…</div>}>
      <CallbackInner />
    </Suspense>
  );
}


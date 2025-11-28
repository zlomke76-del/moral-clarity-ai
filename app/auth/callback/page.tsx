// app/auth/callback/page.tsx

import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export const dynamic = "force-dynamic"; // don't try to pre-render this route
export const runtime = "edge";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center bg-black text-white">
          <div className="text-sm text-neutral-300">
            Finishing sign-in…
          </div>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}


import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export const dynamic = "force-dynamic";
export const revalidate = 0; // never pre-render

export default function Page() {
  return (
    <Suspense fallback={<Splash msg="Completing sign-in…" />}>
      <CallbackClient />
    </Suspense>
  );
}

function Splash({ msg }: { msg: string }) {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="rounded-2xl border border-zinc-800 p-6">
        <p className="text-sm text-zinc-300">{msg}</p>
      </div>
    </div>
  );
}

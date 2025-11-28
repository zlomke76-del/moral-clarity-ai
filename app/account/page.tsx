// app/account/page.tsx

import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function AccountPage() {
  return (
    <div className="flex min-h-screen w-full">
      <NeuralSidebar />

      <main className="relative flex flex-1 items-center justify-center px-8 py-10">
        <section className="max-w-xl w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur-xl">
          <header className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Account
            </p>
            <h1 className="mt-1 text-lg font-semibold text-slate-50">
              Profile &amp; Billing (Coming Online)
            </h1>
          </header>

          <p className="text-sm text-slate-300/90">
            This will become your hub for managing{" "}
            <span className="font-medium">Moral Clarity Studio</span> access:
          </p>

          <ul className="mt-3 space-y-1.5 text-sm text-slate-300/85">
            <li>• Email &amp; profile details</li>
            <li>• Subscription and seat management</li>
            <li>• Invoices, receipts, and payment methods</li>
            <li>• Founder / ministry / family lane controls</li>
          </ul>

          <p className="mt-4 text-xs text-slate-400">
            For now, this page is a placeholder so routing is wired. We can
            gradually plug in Stripe customer portal and any internal admin
            surfaces you want.
          </p>
        </section>
      </main>
    </div>
  );
}

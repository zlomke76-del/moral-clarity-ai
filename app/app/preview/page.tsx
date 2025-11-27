// app/app/preview/page.tsx

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold">Solace Preview</h1>
        <p className="mt-3 text-sm text-slate-300">
          This preview route is now clean. The old FeatureGrid and NeuralSidebar
          have been fully removed. You can wire this page to whatever preview
          experience you want next — a focused demo, a canned conversation, or a
          guided tour.
        </p>
      </div>
    </main>
  );
}

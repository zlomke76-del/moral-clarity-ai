// app/viewer/page.tsx
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Tell Next never to prerender this route
export const dynamicConfig = 'force-dynamic'; // Renamed
export const revalidate = 0;

// react-pdf must only run on the client
const ReactPDF = dynamic(async () => {
  const mod = await import('react-pdf');
  return {
    default: mod,
    Document: mod.Document,
    Page: mod.Page,
    pdfjs: mod.pdfjs,
  } as any;
}, { ssr: false });

export default function ViewerPage() {
  return (
    <Suspense fallback={<Shell>Loading…</Shell>}>
      <ViewerInner />
    </Suspense>
  );
}

function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0b1220] text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Document Viewer</h1>
          <a
            href="/"
            className="rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            Back
          </a>
        </header>
        {children}
      </div>
    </main>
  );
}

function ViewerInner() {
  const params = useSearchParams(); // now safely inside Suspense
  const src = params.get('url') || '';

  const [pdfReady, setPdfReady] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Configure PDF.js worker once
  useEffect(() => {
    (async () => {
      try {
        const mod: any = await import('react-pdf');
        const { pdfjs } = mod;
        pdfjs.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        setPdfReady(true);
      } catch (e: any) {
        setErr(e?.message || 'Failed to initialize PDF engine.');
      }
    })();
  }, []);

  const hasSrc = useMemo(() => typeof src === 'string' && src.length > 0, [src]);

  return (
    <Shell>
      {!hasSrc ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-sm text-zinc-300">
            Provide a PDF via query param, e.g.:{' '}
            <code className="text-zinc-200">/viewer?url=/files/sample.pdf</code>
          </p>
        </div>
      ) : err ? (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
          Error: {err}
        </div>
      ) : !pdfReady ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          Loading PDF engine…
        </div>
      ) : (
        <PDFFrame src={src} onPages={(n) => setNumPages(n)} onError={(m) => setErr(m)} />
      )}

// app/viewer/page.tsx
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';

// If your CSP allows it, this CDN worker is simplest.
// (If it’s blocked, switch to bundling the worker and point to it.)
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ViewerPage() {
  const params = useSearchParams();
  const src = params.get('url') || '';

  const [numPages, setNumPages] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const hasSrc = useMemo(() => typeof src === 'string' && src.length > 0, [src]);

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
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
            <Document
              file={src}
              onLoadSuccess={(meta) => setNumPages(meta.numPages)}
              onLoadError={(e: any) => setErr(e?.message || 'Failed to load PDF.')}
              loading={<div className="p-4">Loading document…</div>}
              error={<div className="p-4 text-red-300">Could not open this PDF.</div>}
            >
              <Pages numPages={numPages ?? 0} />
            </Document>
          </div>
        )}

        {numPages ? (
          <div className="mt-3 text-xs text-zinc-400">{numPages} page(s)</div>
        ) : null}
      </div>
    </main>
  );
}

function Pages({ numPages }: { numPages: number }) {
  if (!numPages) return null;
  // If you want to cap pages for performance, replace numPages with Math.min(numPages, 8)
  return (
    <div className="flex flex-col items-center gap-4">
      {Array.from({ length: numPages }).map((_, i) => (
        <Page
          key={i}
          pageNumber={i + 1}
          width={920}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={<div className="p-4">Rendering page {i + 1}…</div>}
        />
      ))}
    </div>
  );
}

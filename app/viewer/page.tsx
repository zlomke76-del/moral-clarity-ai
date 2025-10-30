// app/viewer/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ViewerPage() {
  const q = useSearchParams();
  const url = q.get("u");              // public URL (Supabase or anywhere)
  const name = decodeURIComponent(q.get("n") || "");
  const ext = (name.split(".").pop() || "").toLowerCase();

  const isPDF = ext === "pdf";
  const isDocx = ext === "docx";

  const [numPages, setNumPages] = useState<number>(0);
  const [docxHtml, setDocxHtml] = useState<string>("");

  useEffect(() => {
    if (!url || !isDocx) return;
    (async () => {
      // client-side .docx → HTML
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const { convertToHtml } = await import("mammoth/mammoth.browser");
      const { value } = await convertToHtml({ arrayBuffer: buf });
      setDocxHtml(value);
    })();
  }, [url, isDocx]);

  if (!url || !name) return <div className="p-6 text-zinc-200">Missing file.</div>;

  return (
    <main className="min-h-screen bg-[#0b1322] text-zinc-100">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1322]/80 px-4 py-3 backdrop-blur">
        <div className="truncate font-medium">{name}</div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold hover:bg-blue-500"
        >
          Download
        </a>
      </header>

      <section className="mx-auto max-w-5xl p-4">
        {isPDF && (
          <Document
            file={url}
            onLoadSuccess={(p) => setNumPages(p.numPages || 0)}
            loading={<div className="p-8">Loading PDF…</div>}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div key={i} className="mb-6 overflow-hidden rounded-lg bg-black/20 p-2">
                <Page pageNumber={i + 1} width={900} renderAnnotationLayer={false} renderTextLayer={false} />
              </div>
            ))}
          </Document>
        )}

        {isDocx && (
          <article
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: docxHtml || "<p>Loading DOCX…</p>" }}
          />
        )}

        {!isPDF && !isDocx && (
          <iframe
            src={url}
            className="h-[80vh] w-full rounded-lg border border-white/10"
            title={name}
          />
        )}
      </section>
    </main>
  );
}

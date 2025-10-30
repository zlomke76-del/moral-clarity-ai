// app/viewer/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { pdfjs } from "react-pdf";

// Worker config (required by pdf.js)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Load react-pdf only on the client to avoid SSR issues
const Document = dynamic(() => import("react-pdf").then(m => m.Document), { ssr: false });
const Page = dynamic(() => import("react-pdf").then(m => m.Page), { ssr: false });

export default function ViewerPage() {
  const [fileUrl, setFileUrl] = useState<string>("/sample.pdf"); // replace as needed
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    // you can read a ?url= query param if you want:
    const u = new URL(window.location.href);
    const q = u.searchParams.get("url");
    if (q) setFileUrl(q);
  }, []);

  function onLoadSuccess(p: PDFDocumentProxy) {
    setNumPages(p.numPages);
  }

  return (
    <div className="mx-auto max-w-4xl p-6 text-white">
      <h1 className="text-lg font-semibold mb-4">Document Viewer</h1>
      <div className="rounded border border-zinc-700 bg-zinc-900 p-3">
        <Document file={fileUrl} onLoadSuccess={onLoadSuccess} loading={<div>Loading…</div>}>
          {Array.from({ length: numPages }, (_, i) => (
            <Page key={i} pageNumber={i + 1} width={900} />
          ))}
        </Document>
      </div>
    </div>
  );
}

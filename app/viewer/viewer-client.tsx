'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';

// use the hosted worker to avoid bundling it
pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ViewerClient() {
  const params = useSearchParams();
  const src = params.get('src') || '';
  const [numPages, setNumPages] = useState<number | null>(null);

  const isPDF = useMemo(() => src.toLowerCase().includes('.pdf'), [src]);
  const isDoc = useMemo(
    () => ['.doc', '.docx'].some(ext => src.toLowerCase().includes(ext)),
    [src]
  );

  if (!src) {
    return (
      <div style={{ padding: 24 }}>
        <b>No file specified.</b> Add <code>?src=URL</code> to the address.
      </div>
    );
  }

  // Simple Office (doc/docx) fall-back via Microsoft viewer
  if (isDoc) {
    const office = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(src)}`;
    return (
      <iframe
        title="Word preview"
        src={office}
        style={{ width: '100%', height: '100vh', border: 0 }}
      />
    );
  }

  // Default: PDF
  if (isPDF) {
    return (
      <div style={{ padding: 12 }}>
        <Document
          file={src}
          onLoadSuccess={(info) => setNumPages(info.numPages)}
          onLoadError={(e) => console.error(e)}
        >
          {Array.from(new Array(numPages || 1), (_, i) => (
            <Page key={`p_${i + 1}`} pageNumber={i + 1} width={920} />
          ))}
        </Document>
      </div>
    );
  }

  // Unknown type: just iframe it
  return (
    <iframe
      title="Preview"
      src={src}
      style={{ width: '100%', height: '100vh', border: 0 }}
    />
  );
}

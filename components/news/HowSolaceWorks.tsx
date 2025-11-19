"use client";

export default function HowSolaceWorks() {
  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/95 p-6 text-slate-100 shadow-xl shadow-slate-900/50">
      {/* Title */}
      <h2 className="mb-2 text-lg font-semibold text-slate-50">
        How Solace Works
      </h2>
      <p className="mb-6 text-sm text-slate-400">
        A fully auditable, deterministic pipeline that transforms raw news into
        transparent, bias-scored analysis.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Stage 1 */}
        <Stage
          number="1"
          title="Snapshot Ingestion"
          icon={IconSnapshot}
          description={
            <>
              Captures raw pages from 40+ outlets.  
              Extracts clean text using Browserless → Tavily → direct fetch.  
              Dedupes. Stores immutable snapshots in <code>truth_facts</code>.
            </>
          }
        />

        {/* Arrow */}
        <Arrow />

        {/* Stage 2 */}
        <Stage
          number="2"
          title="Bias Scoring Engine"
          icon={IconScoring}
          description={
            <>
              For each snapshot, MCAI scores language, framing, source,
              context, intent, and PI.  
              Outputs structured facts, timelines, omissions, and dispute flags
              into <code>news_neutrality_ledger</code>.
            </>
          }
        />

        {/* Arrow */}
        <Arrow />

        {/* Stage 3 */}
        <Stage
          number="3"
          title="Digest Assembly"
          icon={IconDigest}
          description={
            <>
              The system produces a clean, normalized digest via  
              <code>/api/public/news-digest</code>.  
              This is the only data Solace is allowed to read.
            </>
          }
        />

        {/* Arrow */}
        <Arrow />

        {/* Stage 4 */}
        <Stage
          number="4"
          title="Solace Anchor Mode"
          icon={IconSolace}
          description={
            <>
              Solace reads the digest, not the internet.  
              No searches, no guesses, no hallucinated news.  
              Everything is traceable back to the ledger.
            </>
          }
        />
      </div>
    </div>
  );
}

/* ======================================================
   STAGE COMPONENT
   ====================================================== */

function Stage({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string;
  title: string;
  description: React.ReactNode;
  icon: any;
}) {
  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center gap-2 text-slate-300">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200">
          {number}
        </div>
        <span className="text-sm font-semibold text-slate-50">{title}</span>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 shadow-md">
        <Icon className="h-5 w-5 text-slate-200" />
      </div>

      <p className="text-xs leading-relaxed text-slate-300">{description}</p>
    </div>
  );
}

/* ======================================================
   ARROW BETWEEN STAGES
   ====================================================== */

function Arrow() {
  return (
    <div className="hidden items-center justify-center md:flex">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        className="text-slate-600"
        fill="none"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}

/* ======================================================
   ICONS
   ====================================================== */

function IconSnapshot(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconScoring(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3v18M3 12h18M8 8h.01M16 16h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDigest(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 7h8M8 12h8M8 17h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSolace(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 10h6M9 14h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

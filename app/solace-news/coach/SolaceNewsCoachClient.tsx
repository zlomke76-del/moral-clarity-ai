"use client";

import { FormEvent, useState, useMemo, DragEvent } from "react";

type Mode = "critique" | "rewrite";

interface CoachResponse {
  ok?: boolean;
  critique?: string;
  rubric?: any | null;
  uploaded_path?: string;
  error?: string;
  details?: any;
}

interface RubricDisplay {
  bias?: string;
  clarity?: string;
  neutrality?: string;
  emotional_charge?: string;
  structure?: string;
  accuracy_risk?: string;
  suggestions?: string[];
}

export default function SolaceNewsCoachClient() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [mode, setMode] = useState<Mode>("critique");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState<string>("");
  const [rubric, setRubric] = useState<RubricDisplay | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasResponse = useMemo(() => !!responseText.trim(), [responseText]);

  function handleFileSelect(f: File | null) {
    setFile(f);
    setError(null);
    setResponseText("");
    setRubric(null);
    setFilePreview("");

    if (!f) return;

    // Preview first ~8KB of text for UX.
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      if (text) {
        setFilePreview(text.slice(0, 8000));
      }
    };
    reader.readAsText(f);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      handleFileSelect(f);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) {
      handleFileSelect(f);
    }
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResponseText("");
    setRubric(null);

    if (!file) {
      setError("Please select a PDF or DOCX draft first.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mode", mode);

      const res = await fetch("/api/solace-news/coach", {
        method: "POST",
        body: fd,
      });

      const json = (await res.json().catch(() => ({}))) as CoachResponse;

      if (!res.ok || json.error) {
        setError(
          json.error ||
            `Coach API error (${res.status}). Please try again or check the console.`
        );
        console.error("[Coach] error details:", json.details || json);
        return;
      }

      setResponseText(json.critique || "");
      if (json.rubric && typeof json.rubric === "object") {
        setRubric(json.rubric as RubricDisplay);
      } else {
        setRubric(null);
      }
    } catch (err: any) {
      console.error("[Coach] network error:", err);
      setError(err?.message || "Unexpected network error.");
    } finally {
      setLoading(false);
    }
  }

  function handleExportPdf() {
    if (!hasResponse) {
      setError("You need a rewrite or critique before exporting.");
      return;
    }
    // Placeholder: PDF backend not wired yet.
    // This keeps the UI ready without causing 500s.
    alert(
      "PDF export wiring is not yet connected on this environment. The text above is ready to paste into your editorial system."
    );
  }

  const modeLabel =
    mode === "critique"
      ? "Full critique with bias & clarity notes"
      : "Neutral newsroom rewrite (wire-service tone)";

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      {/* LEFT: Upload + Controls */}
      <div className="flex flex-col gap-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-4 md:p-5">
          <header className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Upload draft
              </h2>
              <p className="text-xs text-slate-400">
                PDF or DOCX. Solace will read the full text, not just the
                preview.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
              Journalism Coach
            </span>
          </header>

          <div
            className="mt-1 flex flex-col gap-3"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <label
              htmlFor="coach-file"
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-6 text-center cursor-pointer hover:border-emerald-500/80 hover:bg-slate-900/80 transition"
            >
              <span className="text-xs text-slate-300">
                Drag &amp; drop a draft here, or{" "}
                <span className="text-emerald-300 underline">
                  browse your files
                </span>
                .
              </span>
              <span className="text-[11px] text-slate-500">
                Accepted: .pdf, .docx
              </span>
              {file && (
                <div className="mt-2 text-[11px] text-slate-300">
                  Selected:{" "}
                  <span className="font-medium text-slate-50">
                    {file.name}
                  </span>{" "}
                  ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </label>
            <input
              id="coach-file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={onInputChange}
            />

            <div className="flex flex-col gap-2 rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2.5">
              <span className="text-[11px] text-slate-400 mb-1">
                Output mode
              </span>
              <div className="inline-flex items-center gap-1 rounded-xl bg-slate-900/80 p-1">
                <button
                  type="button"
                  onClick={() => setMode("critique")}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition ${
                    mode === "critique"
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Critique
                </button>
                <button
                  type="button"
                  onClick={() => setMode("rewrite")}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition ${
                    mode === "rewrite"
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Neutral Rewrite
                </button>
              </div>
              <p className="text-[11px] text-slate-400">{modeLabel}</p>
            </div>

            <form onSubmit={onSubmit} className="mt-1 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !file}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading
                  ? "Analyzing…"
                  : mode === "critique"
                  ? "Run critique"
                  : "Generate neutral rewrite"}
              </button>
              <span className="text-[11px] text-slate-500">
                Solace will not change the underlying facts — only tone,
                framing, and structure.
              </span>
            </form>

            {error && (
              <div className="mt-2 rounded-lg border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Preview of extracted text (client-side approximation) */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-4 md:p-5">
          <header className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Draft preview (local)
              </h2>
              <p className="text-xs text-slate-400">
                This is a local preview only. Solace reads the full uploaded
                file.
              </p>
            </div>
          </header>
          <div className="max-h-64 overflow-y-auto rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-[11px] text-slate-300 whitespace-pre-wrap">
            {filePreview
              ? filePreview
              : "No preview available yet. Select a PDF or DOCX draft to see a local excerpt."}
          </div>
        </section>
      </div>

      {/* RIGHT: Results + Rubric */}
      <div className="flex flex-col gap-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-4 md:p-5 flex-1 flex flex-col">
          <header className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                {mode === "critique" ? "Coach report" : "Neutral rewrite"}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === "critique"
                  ? "Bias signals, clarity notes, and suggestions."
                  : "Wire-service style rewrite you can send to an editor."}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-[11px] text-slate-300 hover:border-emerald-500/80 hover:text-emerald-200 transition"
              onClick={handleExportPdf}
            >
              Export as PDF
            </button>
          </header>

          <div className="flex-1 max-h-[420px] overflow-y-auto rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-[11px] text-slate-200 whitespace-pre-wrap">
            {loading && (
              <div className="text-slate-400">Solace is reading your draft…</div>
            )}
            {!loading && !hasResponse && (
              <div className="text-slate-500">
                Run a critique or rewrite to see results here.
              </div>
            )}
            {!loading && hasResponse && <>{responseText}</>}
          </div>
        </section>

        {/* Optional rubric if backend starts returning structured data */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-4 md:p-5">
          <header className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Bias & clarity rubric
              </h2>
              <p className="text-xs text-slate-400">
                When available, Solace’s structured assessment appears here.
              </p>
            </div>
          </header>
          {!rubric && (
            <p className="text-[11px] text-slate-500">
              No structured rubric found in the last response. This is normal
              until the backend enforces JSON-style rubric output.
            </p>
          )}
          {rubric && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-200">
              {rubric.bias && (
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <div className="font-semibold mb-1 text-slate-100">Bias</div>
                  <div className="text-slate-300 whitespace-pre-wrap">
                    {rubric.bias}
                  </div>
                </div>
              )}
              {rubric.clarity && (
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <div className="font-semibold mb-1 text-slate-100">
                    Clarity
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap">
                    {rubric.clarity}
                  </div>
                </div>
              )}
              {rubric.neutrality && (
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <div className="font-semibold mb-1 text-slate-100">
                    Neutrality
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap">
                    {rubric.neutrality}
                  </div>
                </div>
              )}
              {rubric.emotional_charge && (
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <div className="font-semibold mb-1 text-slate-100">
                    Emotional charge
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap">
                    {rubric.emotional_charge}
                  </div>
                </div>
              )}
              {rubric.structure && (
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <div className="font-semibold mb-1 text-slate-100">
                    Structure
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap">
                    {rubric.structure}
                  </div>
                </div>
              )}
              {rubric.accuracy_risk && (
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <div className="font-semibold mb-1 text-slate-100">
                    Accuracy risk
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap">
                    {rubric.accuracy_risk}
                  </div>
                </div>
              )}
              {rubric.suggestions && rubric.suggestions.length > 0 && (
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 sm:col-span-2">
                  <div className="font-semibold mb-1 text-slate-100">
                    Suggestions
                  </div>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {rubric.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

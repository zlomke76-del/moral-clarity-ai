// app/components/SolaceDockPanel.tsx
"use client";

import React from "react";

type Message = { role: "user" | "assistant"; content: string };
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

export default function SolaceDockPanel(props: {
  // state
  messages: Message[];
  input: string;
  streaming: boolean;
  pendingFiles: any[];
  ministryOn: boolean;
  modeHint: ModeHint;
  listening: boolean;
  isMobile: boolean;
  collapsed: boolean;
  invisible: boolean;

  // layout refs
  transcriptRef: React.RefObject<HTMLDivElement>;
  taRef: React.RefObject<HTMLTextAreaElement>;
  containerRef: React.RefObject<HTMLDivElement>;

  // positioning
  tx: number;
  ty: number;
  panelW: number;
  panelH: number;

  // actions
  setInput: (v: string) => void;
  setModeHint: (v: ModeHint) => void;
  send: () => void;
  toggleMinistry: () => void;
  toggleMic: () => void;
  handlePaste: (e: any, opts: any) => void;
  handleFiles: (files: any, opts: any) => void;
  setCollapsed: (v: boolean) => void;
  onHeaderMouseDown: (e: any) => void;
  minimize: () => void;
  setPos: (x: number, y: number) => void;

  // filters (added from your logic file)
  filters?: Set<string>;
}) {
  const {
    messages,
    input,
    streaming,
    pendingFiles,
    ministryOn,
    modeHint,
    listening,
    isMobile,
    collapsed,
    invisible,
    transcriptRef,
    taRef,
    containerRef,
    tx,
    ty,
    setInput,
    setModeHint,
    send,
    toggleMinistry,
    toggleMic,
    handlePaste,
    handleFiles,
    setCollapsed,
    onHeaderMouseDown,
    minimize,
  } = props;

  // ---------------- MOBILE COLLAPSED PILL ----------------
  if (isMobile && collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="
          fixed left-4 right-4 bottom-5 z-[60]
          flex items-center justify-between
          px-4 py-3 rounded-full
          border border-[--mc-border]
          bg-[rgba(6,12,20,0.96)] backdrop-blur-md
          shadow-lg text-[--mc-text]
        "
        aria-label="Open Solace"
      >
        <div className="flex items-center gap-3">
          <div
            className="
              w-[22px] h-[22px] rounded-full
              bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200
              shadow-[0_0_20px_rgba(251,191,36,0.45)]
            "
          />
          <span className="font-semibold text-sm">Solace</span>
        </div>
        <span className="text-xs text-[--mc-muted]">Tap to open</span>
      </button>
    );
  }

  // ---------------- PANEL STYLE ----------------
  const basePanel =
    "fixed flex flex-col rounded-2xl overflow-hidden backdrop-blur-md z-[60]";

  const panelClass = isMobile
    ? `
      ${basePanel}
      left-0 right-0 bottom-0
      h-[70vh] max-h-[80vh]
      border border-[--mc-border]
    `
    : `
      ${basePanel}
      w-[clamp(560px,56vw,980px)]
      h-[clamp(460px,62vh,820px)]
      max-h-[90vh]
      border border-[--mc-border]
      transition-opacity duration-150
    `;

  const panelStyle: React.CSSProperties = isMobile
    ? {
        background:
          "radial-gradient(140% 160% at 50% -60%, rgba(26,35,53,0.85) 0%, rgba(14,21,34,0.88) 60%)",
        opacity: invisible ? 0 : 1,
      }
    : {
        background:
          "radial-gradient(140% 160% at 50% -60%, rgba(26,35,53,0.85) 0%, rgba(14,21,34,0.88) 60%)",
        opacity: invisible ? 0 : 1,
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
      };

  // ---------------- CHIP ----------------
  const Chip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`
        px-3 py-2 rounded-lg border border-[--mc-border]
        text-xs font-semibold
        ${
          active
            ? "bg-[--mc-text] text-black"
            : "bg-[#0e1726] text-[--mc-text]"
        }
      `}
      type="button"
    >
      {label}
    </button>
  );

  // ---------------- HEADER ----------------
  const Header = (
    <header
      onMouseDown={onHeaderMouseDown}
      className={`
        flex items-center gap-3 px-4 py-3
        border-b border-[rgba(255,255,255,.06)]
        ${!isMobile ? "cursor-move select-none" : ""}
        bg-gradient-to-b from-[rgba(255,255,255,.02)] to-transparent
        text-[--mc-text]
      `}
    >
      {/* ORB + TITLE */}
      <div className="flex items-center gap-3">
        <div
          className="
            w-[22px] h-[22px] rounded-full
            bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200
            shadow-[0_0_20px_rgba(251,191,36,0.55)]
          "
        />
        <div className="font-semibold text-sm">Solace</div>
        <div className="text-xs text-[--mc-muted]">
          Create with moral clarity
        </div>
      </div>

      {/* LENSES */}
      <div className="flex gap-2 ml-3">
        <Chip
          label="Create"
          active={modeHint === "Create"}
          onClick={() => props.setModeHint("Create")}
        />
        <Chip
          label="Next"
          active={modeHint === "Next Steps"}
          onClick={() => props.setModeHint("Next Steps")}
        />
        <Chip
          label="Red"
          active={modeHint === "Red Team"}
          onClick={() => props.setModeHint("Red Team")}
        />
      </div>

      {/* ACTIONS */}
      <div className="ml-auto flex items-center gap-2">
        {/* MINISTRY TAB */}
        <button
          type="button"
          onClick={props.toggleMinistry}
          className={`
            px-3 py-2 rounded-lg border text-xs font-bold
            ${
              ministryOn
                ? "bg-yellow-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.6)] border-yellow-300"
                : "bg-[#0e1726] text-[--mc-text] border-[--mc-border]"
            }
          `}
        >
          Ministry
        </button>

        {/* MINIMIZE BUTTON */}
        {!isMobile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              props.minimize();
            }}
            className="
              px-2 py-1 rounded-md
              border border-[--mc-border]
              bg-[#0e1726] text-[--mc-muted]
              text-xs
            "
          >
            _
          </button>
        )}

        {/* MOBILE COLLAPSE */}
        {isMobile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(true);
            }}
            className="
              px-2 py-1 rounded-full
              border border-[--mc-border]
              bg-[#0a0f1a] text-[--mc-muted]
              text-xs
            "
          >
            Hide
          </button>
        )}
      </div>
    </header>
  );

  // ---------------- RENDER ----------------
  return (
    <section
      ref={containerRef}
      className={panelClass}
      style={panelStyle}
      role="dialog"
      aria-label="Solace"
    >
      {Header}

      {/* TRANSCRIPT */}
      <div
        ref={transcriptRef}
        className="
          flex-1 overflow-auto px-4 py-3
          text-[--mc-text]
          bg-[linear-gradient(180deg,rgba(12,19,30,.9),rgba(10,17,28,.92))]
        "
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`
              rounded-xl px-3 py-2 my-1.5 whitespace-pre-wrap
              ${
                m.role === "user"
                  ? "bg-[rgba(39,52,74,.6)] text-[--mc-text]"
                  : "bg-[rgba(28,38,54,.6)] text-[rgba(233,240,250,.94)]"
              }
            `}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* COMPOSER */}
      <div
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
        className="
          border-t border-[rgba(255,255,255,.06)]
          bg-[rgba(12,19,30,.85)]
          p-3
        "
      >
        {/* Pending attachments */}
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 text-[--mc-text] text-xs">
            {pendingFiles.map((f: any, idx: number) => (
              <a
                key={idx}
                href={f.url || f.publicUrl || f.path || "#"}
                target="_blank"
                rel="noreferrer"
                className="
                  px-2 py-1 rounded-lg
                  border border-[--mc-border]
                  bg-[#0e1726]
                  no-underline
                  text-[--mc-text]
                "
                title={f.name}
              >
                📎 {f.name}
              </a>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          {/* Attach + Mic */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>("#solace-file-input")
                  ?.click()
              }
              className="
                w-10 h-10 rounded-xl
                border border-[--mc-border]
                bg-[#0e1726] text-[--mc-text]
              "
            >
              📎
            </button>
            <input
              id="solace-file-input"
              type="file"
              multiple
              className="hidden"
              onChange={(e) =>
                handleFiles(e.target.files, { prefix: "solace" })
              }
            />

            <button
              type="button"
              onClick={toggleMic}
              className={`
                w-10 h-10 rounded-xl
                border border-[--mc-border]
                ${
                  listening
                    ? "bg-green-900 text-[--mc-text]"
                    : "bg-[#0e1726] text-[--mc-text]"
                }
              `}
            >
              {listening ? "■" : "🎤"}
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={taRef}
            value={input}
            placeholder="Speak or type…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="
              flex-1 min-h-[60px] max-h-[240px]
              resize-none rounded-xl
              border border-[--mc-border]
              bg-[#0e1726] text-[--mc-text]
              text-sm px-3 py-2
              outline-none
            "
          />

          {/* Ask */}
          <button
            type="button"
            onClick={send}
            disabled={
              streaming || (!input.trim() && pendingFiles.length === 0)
            }
            className={`
              min-w-[80px] h-10 rounded-xl text-sm font-semibold text-white
              ${
                streaming || (!input.trim() && pendingFiles.length === 0)
                  ? "bg-blue-600 opacity-50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 cursor-pointer"
              }
            `}
          >
            {streaming ? "…" : "Ask"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-2 flex justify-between text-xs text-[--mc-muted]">
          <span>
            {ministryOn ? "Create • Ministry overlay" : modeHint || "Neutral"}
          </span>

          {props.filters && props.filters.size > 0 && (
            <span className="max-w-[60%] truncate">
              Filters: {Array.from(props.filters).join(", ")}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

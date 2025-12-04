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

  // ui palette
  const ui = {
    panelBg:
      "radial-gradient(140% 160% at 50% -60%, rgba(26,35,53,0.85) 0%, rgba(14,21,34,0.88) 60%)",
    edge: "1px solid rgba(255,255,255,.06)",
    border: "border border-[--mc-border]",
    text: "text-[--mc-text]",
    sub: "text-[--mc-muted]",
  };

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
        background: ui.panelBg,
        opacity: invisible ? 0 : 1,
      }
    : {
        background: ui.panelBg,
        opacity: invisible ? 0 : 1,
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
      };

  // ---------------- CHIP UI ----------------
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
        ${active ? "bg-[--mc-text] text-black" : "bg-[#0e1726] text-[--mc-text]"}
      `}
      type="button"
    >
      {label}
    </button>
  );

  // ---------------- MINISTRY TAB ----------------
  const MinistryTab = (
    <button
      onClick={toggleMinistry}
      type="button"
      className={`
        px-3 py-2 rounded-lg border text-xs font-bold
        ${ministryOn
          ? "bg-yellow-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.6)] border-yellow-300"
          : "bg-[#0e1726] text-[--mc-text] border-[--mc-border]"
        }
      `}
    >
      Ministry
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
          title="Alt+Click header to center/reset"
        />
        <div className="font-semibold text-sm">Solace</div>
        <div className="text-xs text-[--mc-muted]">Create with moral clarity</div>
      </div>

      {/* LENSES */}
      <div className="flex gap-2 ml-3">
        <Chip label="Create" active={modeHint === "Create"} onClick={() => props.setModeHint("Create")} />
        <Chip label="Next" active={modeHint === "Next Steps"} onClick={() => props.setModeHint("Next Steps")} />
        <Chip label="Red" active={modeHint === "Red Team"} onClick={() => props.setModeHint("Red Team")} />
      </div>

      {/* ACTIONS */}
      <div className="ml-auto flex items-center gap-2">
        {MinistryTab}

        {/* MINIMIZE BUTTON */}
        {!isMobile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              minimize();
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

  // ------------------------------------------------------------
  // STOP HERE — Part 2 continues with:
  // - transcript
  // - composer area
  // - attachments
  // - buttons
  // - footer status
  // ------------------------------------------------------------

  return (
    <section
      ref={containerRef}
      className={panelClass}
      style={panelStyle}
      role="dialog"
      aria-label="Solace"
    >
      {Header}

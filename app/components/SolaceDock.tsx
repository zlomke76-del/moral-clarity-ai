"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";

import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useDockStyles } from "./useDockStyles";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";
import { useSpeechInput } from "./useSpeechInput";
import { IconPaperclip, IconMic } from "@/app/components/icons";
import { sendWithVision } from "./sendWithVision";
import SolaceTranscript from "./SolaceTranscript";
import { useDockPosition } from "./useDockPosition";
import SolaceDockHeaderLite from "./dock-header-lite";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

import type { SolaceExport } from "@/lib/exports/types";

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------- */
type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

type EvidenceBlock = {
  id?: string;
  source?: string;
  summary?: string;
  text?: string;
};

/* ------------------------------------------------------------------
   Constants
------------------------------------------------------------------- */
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

/* ------------------------------------------------------------------
   Image intent gate
------------------------------------------------------------------- */
function isImageIntent(message: string): boolean {
  const m = (message || "").toLowerCase().trim();
  return (
    m.startsWith("generate an image") ||
    m.startsWith("create an image") ||
    m.startsWith("draw ") ||
    m.includes("image of") ||
    m.includes("picture of") ||
    m.startsWith("make an image") ||
    m.startsWith("make a picture")
  );
}

/* ------------------------------------------------------------------
   Props
------------------------------------------------------------------- */
type SolaceDockProps = {
  onRequestMinimize?: () => void;
};

/* ------------------------------------------------------------------
   MAIN
------------------------------------------------------------------- */
export default function SolaceDock({ onRequestMinimize }: SolaceDockProps) {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).__solaceDockMounted) return;

    (window as any).__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      (window as any).__solaceDockMounted = false;
    };
  }, []);

  const conversationIdRef = useRef<string | null>(null);
  if (!conversationIdRef.current) {
    conversationIdRef.current = crypto.randomUUID();
  }
  const conversationId = conversationIdRef.current;

  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  const modeHint = "Neutral" as const;

  /* ---------------- Viewport ---------------- */
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = viewport.w > 0 ? viewport.w <= 768 : false;

  useEffect(() => {
    if (canRender && !isMobile && !visible) setVisible(true);
  }, [canRender, isMobile, visible, setVisible]);

  /* ---------------- Messages ---------------- */
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo(0, transcriptRef.current.scrollHeight);
  }, [messages]);

  const { userKey, memReady } = useSolaceMemory();

  const { pendingFiles, handleFiles, handlePaste, clearPending } =
    useSolaceAttachments({
      onInfoMessage: (msg) =>
        setMessages((m) => [...m, { role: "assistant", content: msg }]),
    });

  const { toggleMic } = useSpeechInput({
    onText: (text) => setInput((p) => (p ? p + " " : "") + text),
    onError: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

  /* ---------------- Ministry ---------------- */
  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  useEffect(() => {
    try {
      if (localStorage.getItem(MINISTRY_KEY) === "1") {
        const next = new Set(filters);
        next.add("abrahamic");
        next.add("ministry");
        setFilters(next);
      }
    } catch {}
  }, [setFilters]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  /* ---------------- Layout ---------------- */
  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);

  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      setPanelW(r.width);
      setPanelH(r.height);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { posReady, onHeaderMouseDown } = useDockPosition({
    canRender,
    visible,
    viewport,
    panelW,
    panelH,
    isMobile,
    PAD,
    posKey: POS_KEY,
    x,
    y,
    setPos,
  });

  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(dockW, dockH, setDockW, setDockH);

  const vw = viewport.w || 1;
  const vh = viewport.h || 1;

  const mobileW = Math.max(280, Math.min(dockW, vw - PAD * 2));
  const mobileH = Math.max(360, Math.min(dockH, vh - PAD * 2));

  const txDesktop = Math.min(Math.max(0, x - PAD), vw - panelW - PAD);
  const tyDesktop = Math.min(Math.max(0, y - PAD), vh - panelH - PAD);

  const tx = isMobile ? PAD : txDesktop;
  const ty = isMobile ? Math.max(PAD, vh - mobileH - PAD) : tyDesktop;

  const { panelStyle, transcriptStyle, textareaStyle, composerWrapStyle } =
    useDockStyles({
      dockW: isMobile ? mobileW : dockW,
      dockH: isMobile ? mobileH : dockH,
      tx,
      ty,
      invisible: isMobile ? false : !posReady,
      ministryOn,
      PAD,
    });

  const transcriptStyleSafe = isMobile
    ? { ...transcriptStyle, overflowY: "auto", WebkitOverflowScrolling: "touch" }
    : transcriptStyle;

  const panelStyleSafe = isMobile
    ? {
        ...panelStyle,
        width: mobileW,
        height: mobileH,
        maxWidth: vw - PAD * 2,
        maxHeight: vh - PAD * 2,
      }
    : panelStyle;

  if (!canRender || !visible) return null;

  /* ---------------- Payload ingest ---------------- */
  function ingestPayload(data: any) {
    if (!data) throw new Error("Empty response payload");

    if ((data.export as SolaceExport)?.kind === "export") {
      const exp = data.export as SolaceExport;
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Your document is ready.\n\nFile: ${exp.filename}\nDownload: ${exp.url}`,
        },
      ]);
      return;
    }

    if (
      Array.isArray(data.data) &&
      data.data[0]?.b64_json
    ) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: " ",
          imageUrl: `data:image/png;base64,${data.data[0].b64_json}`,
        },
      ]);
      return;
    }

    if (typeof data.imageUrl === "string" || typeof data.image === "string") {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: " ", imageUrl: data.imageUrl ?? data.image },
      ]);
      return;
    }

    if (Array.isArray(data.messages)) {
      setMessages((m) => [...m, ...data.messages]);
      return;
    }

    if (data.ok === true && typeof data.response === "string") {
      setMessages((m) => [...m, { role: "assistant", content: data.response }]);
      return;
    }

    if (Array.isArray(data.evidence)) {
      setMessages((m) => [
        ...m,
        ...data.evidence.map((e: EvidenceBlock) => ({
          role: "assistant",
          content:
            `Evidence${e.source ? ` (${e.source})` : ""}\n\n` +
            (e.summary || e.text || "[no content]"),
        })),
      ]);
      return;
    }

    throw new Error("Unrecognized response payload");
  }

  /* ---------------- Send ---------------- */
  async function send() {
    if (!input.trim() && pendingFiles.length === 0) return;
    if (streaming) return;

    const userMsg = input.trim() || "Attachments:";
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "user", content: userMsg }]);

    try {
      if (isImageIntent(userMsg)) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg,
            canonicalUserKey: userKey,
            workspaceId: MCA_WORKSPACE_ID,
            conversationId,
            ministryMode: ministryOn,
            modeHint,
          }),
        });

        ingestPayload(await res.json());
        return;
      }

      const result = await sendWithVision({
        userMsg,
        pendingFiles,
        userKey,
        workspaceId: MCA_WORKSPACE_ID,
        conversationId,
        ministryOn,
        modeHint,
      });

      result?.visionResults?.forEach((v) =>
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: v?.answer ?? "",
            imageUrl: v?.imageUrl ?? null,
          },
        ])
      );

      if (result?.chatPayload) ingestPayload(result.chatPayload);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠ ${err?.message || "Request failed"}` },
      ]);
    } finally {
      setStreaming(false);
      clearPending();
    }
  }

  /* ---------------- Render ---------------- */
  return createPortal(
    <section ref={containerRef} style={panelStyleSafe}>
      <SolaceDockHeaderLite
        ministryOn={ministryOn}
        memReady={memReady}
        onToggleMinistry={() => {
          const next = new Set(filters);
          ministryOn
            ? (next.delete("abrahamic"), next.delete("ministry"))
            : (next.add("abrahamic"), next.add("ministry"));
          localStorage.setItem(MINISTRY_KEY, ministryOn ? "0" : "1");
          setFilters(next);
        }}
        onMinimize={() => onRequestMinimize?.()}
        onDragStart={(e) => {
          if (!isMobile) onHeaderMouseDown(e);
        }}
      />

      <SolaceTranscript
        messages={messages}
        transcriptRef={transcriptRef}
        transcriptStyle={transcriptStyleSafe}
      />

      <div style={composerWrapStyle} onPaste={(e) => handlePaste(e, { prefix: "solace" })}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ width: 38, height: 38, cursor: "pointer" }}>
            <IconPaperclip />
            <input type="file" multiple hidden onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })} />
          </label>

          <button onClick={toggleMic}><IconMic /></button>

          <textarea
            style={textareaStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="Ask Solace..."
            rows={1}
          />

          <button onClick={send} disabled={streaming}>Ask</button>
        </div>
      </div>

      {!isMobile && <ResizeHandle onResizeStart={startResize} />}
    </section>,
    document.body
  );
}

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
import { UI } from "./dock-ui";
import { useDockPosition } from "./useDockPosition";
import SolaceDockHeaderLite from "./dock-header-lite";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

import type { SolaceExport } from "@/lib/exports/types";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

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

type PendingFile = {
  name: string;
  mime: string;
  url: string;
  size?: number;
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
   MAIN
------------------------------------------------------------------- */
export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;

    window.__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      window.__solaceDockMounted = false;
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

  const [minimized, setMinimized] = useState(false);

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

  const { listening, toggleMic } = useSpeechInput({
    onText: (text) => setInput((p) => (p ? p + " " : "") + text),
    onError: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

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

  // ------------------------------
  // MOBILE CLAMP (no drift)
  // ------------------------------
  const mobileW = Math.max(280, Math.min(dockW, vw - PAD * 2));
  const mobileH = Math.max(360, Math.min(dockH, vh - PAD * 2));

  // Desktop: use stored x/y. Mobile: pin inside viewport.
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

  // iOS scroll polish without changing desktop styling
  const transcriptStyleSafe: React.CSSProperties = isMobile
    ? {
        ...transcriptStyle,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }
    : transcriptStyle;

  // Hard clamp at the container level too (prevents iOS “wider than viewport” weirdness)
  const panelStyleSafe: React.CSSProperties = isMobile
    ? {
        ...panelStyle,
        width: mobileW,
        height: mobileH,
        maxWidth: vw - PAD * 2,
        maxHeight: vh - PAD * 2,
      }
    : panelStyle;

  if (!canRender || !visible) return null;

  /* ------------------------------------------------------------------
     PAYLOAD INGEST (AUTHORITATIVE)
  ------------------------------------------------------------------- */
  function ingestPayload(data: any) {
    if (!data) throw new Error("Empty response payload");

    // EXPORT DELIVERY — MUST PREEMPT EVERYTHING
    if ((data.export as SolaceExport)?.kind === "export") {
      const exp = data.export as SolaceExport;

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            `Your document is ready.\n\n` +
            `File: ${exp.filename}\n` +
            `Download: ${exp.url}`,
        },
      ]);
      return;
    }

    // IMAGE (base64)
    if (
      Array.isArray(data.data) &&
      data.data[0] &&
      typeof data.data[0].b64_json === "string"
    ) {
      const imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
      setMessages((m) => [...m, { role: "assistant", content: " ", imageUrl }]);
      return;
    }

    // IMAGE (url)
    if (typeof data.imageUrl === "string" || typeof data.image === "string") {
      const image = data.imageUrl ?? data.image;
      setMessages((m) => [
        ...m,
        { role: "assistant", content: " ", imageUrl: image },
      ]);
      return;
    }

    // MULTI-MESSAGE
    if (Array.isArray(data.messages)) {
      setMessages((m) => [...m, ...data.messages]);
      return;
    }

    // STRING RESPONSE
    if (data.ok === true && typeof data.response === "string") {
      setMessages((m) => [...m, { role: "assistant", content: data.response }]);
      return;
    }

    // EVIDENCE
    if (Array.isArray(data.evidence)) {
      const evMsgs: Message[] = data.evidence.map((e: EvidenceBlock) => ({
        role: "assistant",
        content:
          `Evidence` +
          (e.source ? ` (${e.source})` : "") +
          `\n\n${e.summary || e.text || "[no content]"}`,
      }));
      setMessages((m) => [...m, ...evMsgs]);
      return;
    }

    throw new Error("Unrecognized response payload");
  }

  /* ------------------------------------------------------------------
     SEND
  ------------------------------------------------------------------- */
  async function send(): Promise<void> {
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

      if (result?.visionResults) {
        for (const v of result.visionResults) {
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content: v?.answer ?? "",
              imageUrl: v?.imageUrl ?? null,
            },
          ]);
        }
      }

      if (result?.chatPayload) {
        ingestPayload(result.chatPayload);
      }
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

  const onEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const panel = (
    <section ref={containerRef} style={panelStyleSafe}>
      <SolaceDockHeaderLite
        ministryOn={ministryOn}
        memReady={memReady}
        onToggleMinistry={() => {
          const next = new Set(filters);
          if (ministryOn) {
            next.delete("abrahamic");
            next.delete("ministry");
            localStorage.setItem(MINISTRY_KEY, "0");
          } else {
            next.add("abrahamic");
            next.add("ministry");
            localStorage.setItem(MINISTRY_KEY, "1");
          }
          setFilters(next);
        }}
        onMinimize={() => setMinimized(true)}
        onDragStart={isMobile ? undefined : onHeaderMouseDown}
      />

      <SolaceTranscript
        messages={messages}
        transcriptRef={transcriptRef}
        transcriptStyle={transcriptStyleSafe}
      />

      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ width: 38, height: 38, cursor: "pointer" }}>
            <IconPaperclip />
            <input
              type="file"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
            />
          </label>

          <button onClick={toggleMic}>
            <IconMic />
          </button>

          <textarea
            style={textareaStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterSend}
            placeholder="Ask Solace..."
            rows={1}
          />

          <button onClick={send} disabled={streaming}>
            Ask
          </button>
        </div>
      </div>

      {!isMobile && <ResizeHandle onResizeStart={startResize} />}
    </section>
  );

  return createPortal(panel, document.body);
}

"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useDockStyles } from "./useDockStyles";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";
import { useSpeechInput } from "./useSpeechInput";
import { IconPaperclip, IconMic } from "@/app/components/icons";
import { sendWithVision } from "./sendWithVision";
import { useDockPosition } from "./useDockPosition";
import SolaceDockHeaderLite from "./dock-header-lite";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

// ✅ Authoritative transcript renderer (dock-ui based)
import SolaceTranscript from "./SolaceTranscript";

// ❌ Removed legacy inline Markdown / highlighting pipeline
// (readability + surfaces now owned by dock-ui transcript)

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
const GOLD = "#FFD700";
const ORB_SIZE = 48;

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
  const canRender = true;

  /* ------------------------------------------------------------
     PORTAL OWNERSHIP (CRITICAL FIX)
  ------------------------------------------------------------ */
  const portalRef = useRef<HTMLDivElement | null>(null);

  if (!portalRef.current && typeof document !== "undefined") {
    portalRef.current = document.createElement("div");
    portalRef.current.id = "solace-portal-root";
  }

  useEffect(() => {
    const el = portalRef.current;
    if (!el) return;

    document.body.appendChild(el);

    return () => {
      el.remove();
    };
  }, []);

  /* ------------------------------------------------------------ */

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
  const [minimizing, setMinimizing] = useState(false);

  const orbPos = useMemo(() => {
    if (!viewport.w || !viewport.h) return { x: 0, y: 0 };
    return {
      x: viewport.w - ORB_SIZE - PAD,
      y: viewport.h - ORB_SIZE - PAD,
    };
  }, [viewport]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!transcriptRef.current) return;
    transcriptRef.current.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
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
    minDragPx: 16,
  });

  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(dockW, dockH, setDockW, setDockH);

  const vw = viewport.w || 1;
  const vh = viewport.h || 1;

  const mobileW = Math.max(280, Math.min(dockW, vw - PAD * 2));
  const mobileH = Math.max(360, Math.min(dockH, vh - PAD * 2));

  const txDesktop = Math.min(Math.max(0, x - PAD), vw - panelW - PAD);
  const tyDesktop = Math.min(Math.max(0, y - PAD), vh - panelH - PAD);

  const tx =
    isMobile || minimized ? PAD : minimizing ? orbPos.x : txDesktop;
  const ty =
    isMobile || minimized
      ? Math.max(PAD, vh - mobileH - PAD)
      : minimizing
      ? orbPos.y
      : tyDesktop;

  const { panelStyle, transcriptStyle, textareaStyle, composerWrapStyle } =
    useDockStyles({
      dockW: isMobile || minimized ? mobileW : dockW,
      dockH: isMobile || minimized ? mobileH : dockH,
      tx,
      ty,
      invisible: isMobile ? false : !posReady,
      ministryOn,
      PAD,
    });

  const panelStyleSafe: React.CSSProperties = {
    ...panelStyle,
    position: "fixed",
    zIndex: 1000,
  };

  const showOrb = !isMobile && minimized;

  function minimizeDock() {
    setMinimizing(true);
    setTimeout(() => {
      setMinimizing(false);
      setMinimized(true);
    }, 400);
  }

function restoreDock() {
  setMinimized(false);
}

if (!canRender || !visible) return null;

/* ------------------------------------------------------------
   PANEL
------------------------------------------------------------ */
const panel = (
  <section
    ref={containerRef}
    style={panelStyleSafe}
    tabIndex={-1}
    aria-label="Solace conversation panel"
  >
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
      onMinimize={minimizeDock}
      onDragStart={(e) => {
        if (!isMobile && !minimized && !minimizing) onHeaderMouseDown(e);
      }}
    />

    <SolaceTranscript
      messages={messages}
      transcriptRef={transcriptRef}
      transcriptStyle={transcriptStyleSafe}
    />

    <div
      style={{ ...composerWrapStyle, paddingTop: 2, paddingBottom: 2 }}
      onPaste={(e) => handlePaste(e, { prefix: "solace" })}
    >
      {/* composer contents unchanged */}
    </div>

    {!isMobile && <ResizeHandle onResizeStart={startResize} />}
  </section>
);

/* ------------------------------------------------------------
   SINGLE RETURN — INSIDE FUNCTION
------------------------------------------------------------ */
return createPortal(
  <>
    {showOrb ? (
      <div
        style={orbStyle}
        onClick={restoreDock}
        aria-label="Restore Solace dock"
      >
        <span
          style={{
            fontWeight: "bold",
            fontSize: 28,
            color: "#fff",
            userSelect: "none",
          }}
        >
          ?
        </span>
      </div>
    ) : (
      panel
    )}
  </>,
  document.body
);
}

  /* ------------------------------------------------------------------
     PAYLOAD INGEST (AUTHORITATIVE)
  ------------------------------------------------------------------- */
  function ingestPayload(data: any) {
    try {
      if (!data) throw new Error("Empty response payload");
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
      if (
        Array.isArray(data.data) &&
        data.data[0] &&
        typeof data.data[0].b64_json === "string"
      ) {
        const imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "", imageUrl },
        ]);
        return;
      }
      if (typeof data.imageUrl === "string" || typeof data.image === "string") {
        const image = data.imageUrl ?? data.image;
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "", imageUrl: image },
        ]);
        return;
      }
      if (Array.isArray(data.messages)) {
        setMessages((m) => [...m, ...data.messages]);
        return;
      }
      if (data.ok === true && typeof data.response === "string") {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.response },
        ]);
        return;
      }
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
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, response format not recognized.",
        },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `? ${err?.message || "Request failed"}`,
        },
      ]);
    }
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
        {
          role: "assistant",
          content: `? ${err?.message || "Request failed"}`,
        },
      ]);
    } finally {
      setStreaming(false);
      clearPending();
    }
  }

/* ------------------------------------------------------------------
   Auto-expanding textarea
------------------------------------------------------------------- */
const textareaRef = useRef<HTMLTextAreaElement | null>(null);
useLayoutEffect(() => {
  const ta = textareaRef.current;
  if (!ta) return;
  ta.style.height = "auto";
  ta.style.overflow = "hidden";
  const scrollHeight = ta.scrollHeight;
  const newHeight = Math.min(scrollHeight, 80);
  ta.style.height = newHeight + "px";
}, [input]);

const onEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
};

const panel = (
  <section
    ref={containerRef}
    style={panelStyleSafe}
    tabIndex={-1}
    aria-label="Solace conversation panel"
  >
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
      onMinimize={() => minimizeDock()}
      onDragStart={(e) => {
        if (!isMobile && !minimized && !minimizing) onHeaderMouseDown(e);
      }}
    />

    <SolaceTranscript
      messages={messages}
      transcriptRef={transcriptRef}
      transcriptStyle={transcriptStyleSafe}
    />

    <div
      style={{ ...composerWrapStyle, paddingTop: 2, paddingBottom: 2 }}
      onPaste={(e) => handlePaste(e, { prefix: "solace" })}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          minHeight: 44,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <label
          style={{
            width: 38,
            height: 38,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 28,
              width: 28,
            }}
          >
            <IconPaperclip
              style={{ width: 24, height: 24, verticalAlign: "middle" }}
            />
          </span>
          <input
            type="file"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
          />
        </label>

        <button
          onClick={toggleMic}
          aria-label="Toggle microphone"
          style={{
            width: 38,
            height: 38,
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            outline: "none",
          }}
          tabIndex={0}
          type="button"
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 28,
              width: 28,
            }}
          >
            <IconMic
              style={{ width: 24, height: 24, verticalAlign: "middle" }}
            />
          </span>
        </button>

        <textarea
          ref={textareaRef}
          style={{
            ...textareaStyle,
            minHeight: 38,
            maxHeight: 80,
            fontSize: 16,
            lineHeight: 1.4,
            borderRadius: 6,
            border: "1px solid #ddd",
            padding: "7px 10px",
            flex: 1,
            resize: "none",
            overflow: "hidden",
            transition: "height 0.15s ease",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onEnterSend}
          placeholder="Ask Solace..."
          rows={1}
          aria-label="Input for Solace"
        />

        <button
          onClick={send}
          disabled={streaming}
          style={{
            minWidth: 54,
            height: 38,
            border: "none",
            borderRadius: 7,
            background: GOLD,
            color: "#333",
            fontWeight: 600,
            fontSize: 16,
            boxShadow: "0 1.5px 4px #0001",
            cursor: streaming ? "not-allowed" : "pointer",
            opacity: streaming ? 0.6 : 1,
            transition: "background 0.15s, color 0.15s, box-shadow 0.2s",
            marginLeft: 2,
          }}
          type="button"
          aria-label="Send"
        >
          Ask
        </button>
      </div>
    </div>

    {!isMobile && <ResizeHandle onResizeStart={startResize} />}
  </section>
);

/* ------------------------------------------------------------
   SINGLE RETURN — MUST BE INSIDE SolaceDock()
------------------------------------------------------------ */
return createPortal(
  <>
    {showOrb ? (
      <div
        style={orbStyle}
        onClick={restoreDock}
        aria-label="Restore Solace dock"
      >
        <span
          style={{
            fontWeight: "bold",
            fontSize: 28,
            color: "#fff",
            userSelect: "none",
          }}
        >
          ?
        </span>
      </div>
    ) : (
      panel
    )}
  </>,
  document.body
);

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

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

// ------------------------------------------------------------
// Image intent detector
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  // ------------------------------------------------------------
  // One-time mount protection
  // ------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;

    window.__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  // ------------------------------------------------------------
  // Stable conversation ID
  // ------------------------------------------------------------
  const conversationIdRef = useRef<string | null>(null);
  if (!conversationIdRef.current) {
    conversationIdRef.current = crypto.randomUUID();
  }
  const conversationId = conversationIdRef.current;

  // ------------------------------------------------------------
  // Store
  // ------------------------------------------------------------
  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  const modeHint = "Neutral" as const;

  // ------------------------------------------------------------
  // Viewport
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Ministry state (LOCKED DEFAULT OFF)
  // ------------------------------------------------------------
  const didHydrateRef = useRef(false);

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  useEffect(() => {
    if (didHydrateRef.current) return;
    didHydrateRef.current = true;

    try {
      const persisted = localStorage.getItem(MINISTRY_KEY);
      const next = new Set(filters);

      if (persisted === "1") {
        next.add("abrahamic");
        next.add("ministry");
      } else {
        next.delete("abrahamic");
        next.delete("ministry");
      }

      setFilters(next);
    } catch {
      const next = new Set(filters);
      next.delete("abrahamic");
      next.delete("ministry");
      setFilters(next);
    }
  }, [setFilters]);

  // ------------------------------------------------------------
  // Minimized
  // ------------------------------------------------------------
  const [minimized, setMinimized] = useState(false);

  // ------------------------------------------------------------
  // Chat state
  // ------------------------------------------------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo(0, transcriptRef.current.scrollHeight);
  }, [messages]);

  // ------------------------------------------------------------
  // Memory + attachments
  // ------------------------------------------------------------
  const { userKey, memReady } = useSolaceMemory();

  const { pendingFiles, handleFiles, handlePaste, clearPending } =
    useSolaceAttachments({
      onInfoMessage: (msg) =>
        setMessages((m) => [...m, { role: "assistant", content: msg }]),
    });

  // ------------------------------------------------------------
  // Microphone
  // ------------------------------------------------------------
  const { listening, toggleMic } = useSpeechInput({
    onText: (text) => setInput((p) => (p ? p + " " : "") + text),
    onError: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

  // ------------------------------------------------------------
  // Initial assistant message
  // ------------------------------------------------------------
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  // ------------------------------------------------------------
  // Measure panel
  // ------------------------------------------------------------
  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

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

  // ------------------------------------------------------------
  // Resize
  // ------------------------------------------------------------
  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(dockW, dockH, setDockW, setDockH);

  // ------------------------------------------------------------
  // Styles
  // ------------------------------------------------------------
  const vw = viewport.w || 1;
  const vh = viewport.h || 1;

  const tx = Math.min(Math.max(0, x - PAD), vw - panelW - PAD);
  const ty = Math.min(Math.max(0, y - PAD), vh - panelH - PAD);

  const { panelStyle, transcriptStyle, textareaStyle, composerWrapStyle } =
    useDockStyles({
      dockW,
      dockH,
      tx,
      ty,
      invisible: !posReady,
      ministryOn,
      PAD,
    });

  // ------------------------------------------------------------
  // Early returns
  // ------------------------------------------------------------
  if (!canRender || !visible) return null;

  if (minimized) {
    return createPortal(
      <button
        onClick={() => setMinimized(false)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background:
            "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1) 0%, rgba(251,191,36,.65) 38%, rgba(251,191,36,.22) 72%, rgba(251,191,36,.12) 100%)",
          boxShadow: "0 0 26px rgba(251,191,36,.55)",
          fontWeight: 700,
          cursor: "pointer",
        }}
        aria-label="Open Solace Dock"
      >
        S
      </button>,
      document.body
    );
  }

  // ------------------------------------------------------------
  // Payload ingestion
  // ------------------------------------------------------------
  function ingestPayload(data: any) {
    if (!data) throw new Error("Empty response payload");

    if (
      Array.isArray(data.data) &&
      data.data[0] &&
      typeof data.data[0].b64_json === "string"
    ) {
      const base64 = data.data[0].b64_json;
      setMessages((m) => [
        ...m,
        { role: "assistant", content: " ", imageUrl: `data:image/png;base64,${base64}` },
      ]);
      return;
    }

    if (Array.isArray(data.messages)) {
      setMessages((m) => [
        ...m,
        ...data.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content ?? "",
          imageUrl: msg.imageUrl ?? null,
        })),
      ]);
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
            "Evidence" +
            (e.source ? ` (${e.source})` : "") +
            "\n\n" +
            (e.summary || e.text || "[no content]"),
        })),
      ]);
      return;
    }

    throw new Error("Unrecognized response payload");
  }

  // ------------------------------------------------------------
  // Send handler
  // ------------------------------------------------------------
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

      if (result?.visionResults) {
        for (const v of result.visionResults) {
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content: v.answer ?? "",
              imageUrl: v.imageUrl ?? null,
            },
          ]);
        }
      }

      if (result?.chatPayload) {
        ingestPayload(result.chatPayload);
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: `⚠ ${err.message}` }]);
    } finally {
      setStreaming(false);
      clearPending();
    }
  }

  // ------------------------------------------------------------
  // Enter-to-send
  // ------------------------------------------------------------
  const onEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return createPortal(
    <section ref={containerRef} style={panelStyle}>
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
        onDragStart={onHeaderMouseDown}
      />

      <SolaceTranscript
        messages={messages}
        transcriptRef={transcriptRef}
        transcriptStyle={transcriptStyle}
      />

      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: UI.surface2,
              cursor: "pointer",
            }}
          >
            <IconPaperclip />
            <input
              type="file"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
            />
          </label>

          <button
            onClick={toggleMic}
            style={{
              width: 38,
              height: 38,
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: listening ? "rgba(255,0,0,.45)" : UI.surface2,
              cursor: "pointer",
            }}
          >
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

          <button
            onClick={send}
            disabled={streaming}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: UI.radiusMd,
              background: "#fbbf24",
              fontWeight: 600,
            }}
          >
            Ask
          </button>
        </div>
      </div>

      <ResizeHandle onResizeStart={startResize} />
    </section>,
    document.body
  );
}

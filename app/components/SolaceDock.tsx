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

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

/* ------------------------------------------------------------------ */
/* Image intent gate */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* MAIN */
/* ------------------------------------------------------------------ */
export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  /* ---------- SINGLE INSTANCE GUARD ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;

    window.__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  /* ---------- CONVERSATION ID ---------- */
  const conversationIdRef = useRef<string | null>(null);
  if (!conversationIdRef.current) {
    conversationIdRef.current = crypto.randomUUID();
  }
  const conversationId = conversationIdRef.current;

  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  const modeHint = "Neutral" as const;

  /* ---------- VIEWPORT ---------- */
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

  /* ------------------------------------------------------------------ */
  /* STATE */
  /* ------------------------------------------------------------------ */
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  /* ---------- HARD SEND LOCK (CRITICAL) ---------- */
  const sendLockRef = useRef(false);

  /* ---------- DRAG / RESIZE LOCK ---------- */
  const interactionLockRef = useRef(false);

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
    onText: (text) =>
      setInput((p) => (p ? p + " " : "") + text),
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

  /* ------------------------------------------------------------------ */
  /* MEASURE */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /* SEND (HARDENED) */
  /* ------------------------------------------------------------------ */
  async function send(): Promise<void> {
    if (sendLockRef.current) return;
    if (interactionLockRef.current) return;
    if (streaming) return;
    if (!input.trim() && pendingFiles.length === 0) return;

    sendLockRef.current = true;

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
      sendLockRef.current = false;
    }
  }

  /* ---------- KEYDOWN HARDENING ---------- */
  const onEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key !== "Enter" ||
      e.shiftKey ||
      e.repeat ||
      (e.nativeEvent as any)?.isComposing ||
      !e.isTrusted
    ) {
      return;
    }

    e.preventDefault();
    send();
  };

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */
  if (!canRender || !visible) return null;

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
        onDragStart={(e) => {
          interactionLockRef.current = true;
          if (!isMobile) onHeaderMouseDown(e);
        }}
        onDragEnd={() => {
          interactionLockRef.current = false;
        }}
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
              onChange={(e) =>
                handleFiles(e.target.files, { prefix: "solace" })
              }
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
            disabled={interactionLockRef.current}
          />

          <button onClick={send} disabled={streaming}>
            Ask
          </button>
        </div>
      </div>

      {!isMobile && (
        <ResizeHandle
          onResizeStart={() => {
            interactionLockRef.current = true;
          }}
          onResizeEnd={() => {
            interactionLockRef.current = false;
          }}
        />
      )}
    </section>
  );

  return createPortal(panel, document.body);
}

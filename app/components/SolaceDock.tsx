"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";

import { UI } from "./dock-ui";
import { Skins } from "./dock-skins";
import SolaceDockHeader from "./dock-header";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

type ModeHint = "Create" | "Red Team" | "Next Steps" | "Neutral";

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const FOUNDER_KEY = "solace:founder";
const PAD = 12;

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function isImageFile(f: any) {
  const mime = f?.mime || f?.type || "";
  return (
    mime.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(f?.name || "")
  );
}

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
export default function SolaceDock() {
  const supabase = createClientComponentClient();

  // ----------------------------------------------------------------
  // One-time mount protection
  // ----------------------------------------------------------------
  const [canRender, setCanRender] = useState(false);
  useEffect(() => {
    if ((window as any).__solaceDockMounted) return;
    (window as any).__solaceDockMounted = true;
    setCanRender(true);
    return () => {
      (window as any).__solaceDockMounted = false;
    };
  }, []);

  // ----------------------------------------------------------------
  // Store state
  // ----------------------------------------------------------------
  const {
    visible,
    setVisible,
    x,
    y,
    setPos,
    filters,
    setFilters,
    founderMode,
    setFounderMode,
    modeHint,
    setModeHint,
  } = useSolaceStore();

  // ----------------------------------------------------------------
  // Mobile detection
  // ----------------------------------------------------------------
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (canRender && !isMobile && !visible) setVisible(true);
  }, [canRender, isMobile, visible, setVisible]);

  // ----------------------------------------------------------------
  // UI state
  // ----------------------------------------------------------------
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo(0, transcriptRef.current.scrollHeight);
  }, [messages]);

  // ----------------------------------------------------------------
  // Memory + attachments
  // ----------------------------------------------------------------
  const { userKey, memReady } = useSolaceMemory();

  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

  // ----------------------------------------------------------------
  // Ministry + Founder hydration
  // ----------------------------------------------------------------
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
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(FOUNDER_KEY) === "1") {
        setFounderMode(true);
      }
    } catch {}
  }, []);

  // ----------------------------------------------------------------
  // Initial message
  // ----------------------------------------------------------------
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  // ----------------------------------------------------------------
  // Upload image → Supabase → public URL
  // ----------------------------------------------------------------
  async function uploadImageToSupabase(f: any): Promise<string> {
    const res = await fetch(f.url);
    const blob = await res.blob();

    const ext = f.name.split(".").pop() || "png";
    const path = `vision/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("solace-uploads")
      .upload(path, blob, {
        contentType: f.mime || f.type || "image/png",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("solace-uploads")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  // ----------------------------------------------------------------
  // Chat → /api/chat
  // ----------------------------------------------------------------
  async function sendToChat(userMsg: string, prevHistory: Message[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        history: prevHistory,
        workspaceId: MCA_WORKSPACE_ID,
        ministryMode: ministryOn,
        founderMode,
        modeHint,
        userKey,
      }),
    });

    const data = await res.json();
    return { text: data.text ?? "", imageUrl: data.imageUrl ?? null };
  }

  // ----------------------------------------------------------------
  // Vision → upload → /api/solace/vision
  // ----------------------------------------------------------------
  async function sendToVision(userMsg: string) {
    const imageFile = pendingFiles.find(isImageFile);

    if (!imageFile) {
      clearPending();
      return { text: "", imageUrl: null };
    }

    let publicUrl = imageFile.publicUrl;

    if (!publicUrl) {
      publicUrl = await uploadImageToSupabase(imageFile);
      imageFile.publicUrl = publicUrl;
    }

    const prompt =
      userMsg.trim() || "Look at this image and describe what you see.";

    const res = await fetch("/api/solace/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageUrl: publicUrl }),
    });

    const data = await res.json();
    clearPending();

    return { text: data.answer ?? "", imageUrl: null };
  }

  // ----------------------------------------------------------------
  // MAIN SEND
  // ----------------------------------------------------------------
  async function send() {
    if (streaming) return;

    const hasImage = pendingFiles.some(isImageFile);
    const userMsg = input.trim() || "Attachments:";

    if (!userMsg && !hasImage) return;

    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "user", content: userMsg }]);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = hasImage
        ? await sendToVision(userMsg)
        : await sendToChat(userMsg, history);

      setMessages((m) => [
        ...m,
        { role: "assistant", content: reply.text },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: err?.message || "Error" },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  // ----------------------------------------------------------------
  // ENTER SEND
  // ----------------------------------------------------------------
  function onEnterSend(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ----------------------------------------------------------------
  // Early exits
  // ----------------------------------------------------------------
  if (!canRender || !visible) return null;

  // ----------------------------------------------------------------
  // UI (unchanged visuals)
  // ----------------------------------------------------------------
  const skin = Skins.default;

  const panel = (
    <section
      style={{
        position: "fixed",
        left: PAD,
        top: PAD,
        width: 760,
        height: 560,
        background: skin.panelBg,
        borderRadius: UI.radiusLg,
        border: skin.border,
        boxShadow: ministryOn ? UI.glowOn : UI.shadow,
        display: "flex",
        flexDirection: "column",
        zIndex: 60,
      }}
    >
      <SolaceDockHeader
        ministryOn={ministryOn}
        founderMode={founderMode}
        modeHint={modeHint}
        memReady={memReady}
        onToggleMinistry={() => {}}
        onToggleFounder={() => {}}
        onMinimize={() => setMinimized(true)}
        setModeHint={setModeHint}
        onDragStart={() => {}}
      />

      <div ref={transcriptRef} style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            {m.content}
          </div>
        ))}
      </div>

      <div onPaste={(e) => handlePaste(e, { prefix: "solace" })}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onEnterSend}
          placeholder="Ask Solace…"
          style={{ width: "100%", minHeight: 60 }}
        />
        <button onClick={send} disabled={streaming}>
          Ask
        </button>
      </div>

      <ResizeHandle onResizeStart={() => {}} />
    </section>
  );

  return createPortal(panel, document.body);
}

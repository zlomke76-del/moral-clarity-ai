// app/components/SolaceDock.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";
import Header from "./Header";
import Transcript from "./Transcript";
import Composer from "./Composer";

export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);
  const { visible, x, y, setPos, filters, setFilters } = useSolaceStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const transcriptRef = useRef(null);
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();
  const { pendingFiles, handleFiles, clearPending } = useSolaceAttachments();

  useEffect(() => {
    if (typeof window !== "undefined" && !window.__solaceDockMounted) {
      window.__solaceDockMounted = true;
      setCanRender(true);
    }
  }, []);

  const send = async () => {
    // Sending logic...
  };

  const toggleMinistry = () => {
    // Toggle logic...
  };

  const toggleMic = () => {
    // Microphone logic...
  };

  if (!canRender || !visible) return null;

  return createPortal(
    <section role="dialog" aria-label="Solace" style={panelStyle}>
      <Header onMinistryToggle={toggleMinistry} ministryOn={ministryOn} />
      <Transcript messages={messages} />
      <Composer input={input} setInput={setInput} send={send} streaming={streaming} pendingFiles={pendingFiles} handleFiles={handleFiles} toggleMic={toggleMic} />
    </section>,
    document.body
  );
}

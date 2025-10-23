// app/solace/skins/GlassSkin.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useSolaceChat } from "../core/useSolaceChat";
import { SolaceChatPrimitive, DefaultTranscript } from "../primitive/SolaceChatPrimitive";

export default function GlassSkin({ filters, lastMode }: { filters?: string[]; lastMode?: string }) {
  const { messages, busy, send, clear } = useSolaceChat({ filters, lastMode });
  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "0px";
    taRef.current.style.height = Math.min(160, taRef.current.scrollHeight) + "px";
  }, [input]);

  return (
    <SolaceChatPrimitive
      className="solace glass"
      header={
        <div className="solace__header">
          <div className="dot" /><span>Solace</span>
          <div className="spacer" />
          <button onClick={clear} className="ghost">Clear</button>
        </div>
      }
      transcript={
        <div className="solace__scroll">
          <DefaultTranscript messages={messages} />
        </div>
      }
      composer={
        <div className="solace__composer">
          <textarea
            ref={taRef}
            value={input}
            placeholder="Speak or type…"
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(input); setInput(""); }}}
          />
          <button disabled={busy || !input.trim()} onClick={()=>{send(input); setInput("");}}>
            {busy ? "…" : "Send"}
          </button>
        </div>
      }
    />
  );
}


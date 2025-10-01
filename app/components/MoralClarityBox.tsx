"use client";
import { useState } from "react";
import type { Mode } from "@/lib/chatClient";
import { sendChat } from "@/lib/chatClient";

export default function MoralClarityBox(){
  const [mode, setMode] = useState<Mode>("guidance");
  const [log, setLog] = useState<{role:"user"|"assistant"; content:string}[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSend(){
    if(!input.trim()) return;
    setBusy(true);
    const next = [...log, {role:"user", content: input}];
    setLog(next);
    setInput("");
    try{
      const text = await sendChat(
        [{role:"system", content:""}, ...next],
        mode
      );
      setLog([...next, {role:"assistant", content:text}]);
    }catch(e:any){
      setLog([...next, {role:"assistant", content:`Error: ${e.message}`}]);
    }finally{
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 max-w-2xl w-full">
      <div className="flex gap-2">
        <label className="text-sm font-medium">Mode</label>
        <select value={mode} onChange={e=>setMode(e.target.value as Mode)} className="border rounded p-2">
          <option value="guidance">Guidance</option>
          <option value="redteam">Red-Team</option>
          <option value="news">News Clarity</option>
        </select>
      </div>

      <div className="border p-3 h-72 overflow-auto text-sm bg-white rounded">
        {log.length===0 && <div className="opacity-60">Start the conversation…</div>}
        {log.map((m,i)=>(
          <div key={i} className="mb-2">
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Ask anything…"
          onKeyDown={(e)=>{ if(e.key==="Enter") onSend(); }}
        />
        <button onClick={onSend} disabled={busy} className="px-4 py-2 bg-black text-white rounded">
          {busy ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
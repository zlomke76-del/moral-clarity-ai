// app/components/Composer.tsx
import React from "react";

type ComposerProps = {
  input: string;
  setInput: (value: string) => void;
  send: () => void;
  streaming: boolean;
  pendingFiles: any[]; // Adjust type as necessary
  handleFiles: (files: FileList) => void;
  toggleMic: () => void;
};

const Composer: React.FC<ComposerProps> = ({ input, setInput, send, streaming, pendingFiles, handleFiles, toggleMic }) => (
  <div style={composerWrapStyle}>
    {pendingFiles.length > 0 && <PendingFiles pendingFiles={pendingFiles} />}
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => document.querySelector("#solace-file-input").click()} title="Attach files" style={attachButtonStyle}>
          📎
        </button>
        <input id="solace-file-input" type="file" multiple style={{ display: "none" }} onChange={handleFiles} />
        <button onClick={toggleMic} title={listening ? "Stop mic" : "Speak"} style={micButtonStyle(listening)}>
          {listening ? "■" : "🎤"}
        </button>
      </div>
      <textarea value={input} placeholder="Speak or type…" onChange={(e) => setInput(e.target.value)} style={fieldStyle} />
      <button onClick={send} type="button" disabled={streaming || (!input.trim() && pendingFiles.length === 0)} style={askBtnStyle}>
        {streaming ? "…" : "Ask"}
      </button>
    </div>
  </div>
);

export default Composer;

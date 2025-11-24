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

const Composer: React.FC<ComposerProps> = ({ input, setInput, send, streaming, pendingFiles, handleFiles, toggleMic }) => {
  // Define styles
  const composerWrapStyle: React.CSSProperties = {
    borderTop: "1px solid var(--mc-border)",
    background: "rgba(12,19,30,.85)",
    padding: 10,
  };

  const attachButtonStyle: React.CSSProperties = {
    cursor: "pointer",
    background: "transparent",
    border: "none",
    fontSize: "20px",
  };

  const micButtonStyle = (listening: boolean): React.CSSProperties => ({
    cursor: "pointer",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    color: listening ? "red" : "black",
  });

  const fieldStyle: React.CSSProperties = {
    flex: 1,
    border: "1px solid var(--mc-border)",
    borderRadius: "4px",
    padding: "8px",
    resize: "none",
  };

  const askBtnStyle: React.CSSProperties = {
    cursor: "pointer",
    background: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
  };

  return (
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
};

export default Composer;

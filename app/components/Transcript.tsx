// app/components/Transcript.tsx
import React from "react";

const Transcript = ({ messages }) => (
  <div ref={transcriptRef} style={transcriptStyle} aria-live="polite">
    {messages.map((m, i) => (
      <div key={i} style={messageStyle(m.role)}>
        {m.content}
      </div>
    ))}
  </div>
);

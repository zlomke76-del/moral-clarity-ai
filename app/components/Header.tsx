// app/components/Header.tsx
import React from "react";

const Header = ({ onMinistryToggle, ministryOn }) => (
  <header style={headerStyle}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span aria-hidden style={orbStyle} title="Alt+Click header to center/reset" />
      <span style={{ font: "600 13px system-ui", color: ui.text }}>Solace</span>
      <span style={{ font: "12px system-ui", color: ui.sub }}>Create with moral clarity</span>
      <span title={memReady ? "Memory ready" : "Loading memory…"} style={memoryStatusStyle(memReady)} />
    </div>
    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
      <button onClick={onMinistryToggle} title="Ministry mode" style={ministryTabStyle(ministryOn)}>
        Ministry
      </button>
    </div>
  </header>
);

export default Header;

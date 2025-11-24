// app/components/Header.tsx
import React from "react";

// Define the props interface
interface HeaderProps {
  onMinistryToggle: () => void; // Adjust the type as necessary
  ministryOn: boolean; // Assuming this is a boolean
}

const Header: React.FC<HeaderProps> = ({ onMinistryToggle, ministryOn }) => {
  const headerStyle: React.CSSProperties = {
    // Define your styles here
  };

  const orbStyle: React.CSSProperties = {
    // Define your styles here
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span aria-hidden style={orbStyle} title="Alt+Click header to center/reset" />
        {/* Add other header elements here */}
        <button onClick={onMinistryToggle}>
          {ministryOn ? "Ministry On" : "Ministry Off"}
        </button>
      </div>
    </header>
  );
};

export default Header;

"use client";

import NeuralSidebar from "@/app/components/NeuralSidebar";
import "../globals.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* LEFT SIDEBAR */}
      <NeuralSidebar />

      {/* RIGHT CONTENT AREA */}
      <main
        className="
          flex-1 
          flex 
          items-center 
          justify-center 
          p-6
        "
      >
        {children}
      </main>

    </div>
  );
}

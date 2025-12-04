// app/layout.tsx
import "./globals.css";
import { Suspense } from "react";
import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* Background */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>
          <div className="flex h-screen w-screen overflow-hidden">

            {/* LEFT SIDEBAR — ONLY PLACE IT SHOULD EXIST */}
            <aside className="w-64 border-r border-neutral-800 bg-neutral-900/40">
              <NeuralSidebar />
            </aside>

            {/* PAGE CONTENT */}
            <main className="flex-1 relative overflow-hidden">
              {children}
            </main>
          </div>

          {/* Solace + overlays */}
          <div className="mc-ui">
            <Suspense><SolaceGuard /></Suspense>
            <Suspense><Toaster /></Suspense>
          </div>

        </AuthProvider>
      </body>
    </html>
  );
}


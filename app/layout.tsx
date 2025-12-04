import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import Toaster from "@/components/Toaster";
import { Suspense } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className="min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/Global-CSS-Background.png")' }}
      >

        <AuthProvider>

          {/* --- Page Frame (Sidebar + Page Content) --- */}
          <div className="flex min-h-screen w-full">

            {/* LEFT SIDEBAR */}
            <NeuralSidebar />

            {/* MAIN PAGE CONTENT */}
            <main className="flex-1 p-0 m-0">
              {children}
            </main>

          </div>

          {/* Floating overlays */}
          <Suspense><SolaceGuard /></Suspense>
          <Suspense><Toaster /></Suspense>

        </AuthProvider>

      </body>
    </html>
  );
}



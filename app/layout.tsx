// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import DemoBadge from "@/components/DemoBadge";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moralclarity.ai"),
  title: { default: "Moral Clarity AI", template: "%s • Moral Clarity AI" },
  description: "Anchored answers. Neutral • Guidance • Ministry.",
  openGraph: {
    type: "website",
    siteName: "Moral Clarity AI",
    url: "https://www.moralclarity.ai",
  },
  twitter: {
    card: "summary_large_image",
    site: "@",
    creator: "@",
  },
  icons: {
    icon: "/MoralClarityAI_QuietDepth_Logos/icon-180.png",
    apple: "/MoralClarityAI_QuietDepth_Logos/icon-180.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            {/* Brand + optional Demo badge */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/MoralClarityAI_QuietDepth_Logos/icon-180.png"
                  alt="Moral Clarity AI"
                  width={24}
                  height={24}
                  priority
                  className="rounded"
                />
                <span className="brand font-semibold leading-none tracking-tight">
                  Moral Clarity AI
                </span>
              </Link>
              <DemoBadge />
            </div>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <Link href="/pricing" className="hover:opacity-80 leading-none">
                Pricing
              </Link>
              <Link href="/docs" className="hover:opacity-80 leading-none">
                Docs
              </Link>
              <Link href="/contact" className="hover:opacity-80 leadin

// components/TopNav.tsx
import Link from "next/link";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">MoralClarity.ai</Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm text-zinc-700">
            <Link href="/memories" className="hover:opacity-80">Memory</Link>
            {/* Add other product areas when ready */}
            {/* <Link href="/journey" className="hover:opacity-80">Journey</Link> */}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {/* Placeholder: you can wire a user avatar/menu here */}
          <Link
            href="/memories"
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50"
          >
            My workspace
          </Link>
        </div>
      </div>
    </header>
  );
}

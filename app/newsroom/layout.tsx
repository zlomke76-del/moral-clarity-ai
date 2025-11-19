// app/newsroom/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "Moral Clarity Newsroom",
  description: "Solace-guided newsroom workspace",
};

export default function NewsroomLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-screen-lg mx-auto px-6 py-10">
        {/* Top Title */}
        <header className="mb-12 border-b pb-6">
          <h1 className="text-4xl font-serif tracking-tight">
            Moral Clarity Newsroom
          </h1>
          <p className="text-neutral-600 text-sm mt-2">
            Powered by Solace — neutral, transparent, ethical journalism tools.
          </p>
        </header>

        {children}
      </div>
    </div>
  );
}

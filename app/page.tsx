// app/page.tsx

import SolaceDock from "./components/SolaceDock";

export const metadata = {
  title: "Solace • Moral Clarity AI",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      {/* Center Solace on the page, nothing else */}
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-10 md:py-16">
        <SolaceDock />
      </div>
    </main>
  );
}

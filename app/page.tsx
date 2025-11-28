// app/page.tsx
import SolaceDock from "./components/SolaceDock";
import NeuralShell from "./components/NeuralShell";
import NeuralSidebar from "./components/NeuralSidebar";

export const metadata = {
  title: "Solace • Moral Clarity AI",
};

export default function HomePage() {
  return (
    <NeuralShell>
      <div className="flex min-h-screen items-stretch">
        {/* Left: Neural sidebar (chip-style cards) */}
        <NeuralSidebar />

        {/* Right: main Solace workstation area */}
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <SolaceDock />
        </main>
      </div>
    </NeuralShell>
  );
}


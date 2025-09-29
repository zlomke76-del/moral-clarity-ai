export default function App() {
  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-5xl font-extrabold text-gray-900">Moral Clarity AI</h1>
        <p className="mt-4 text-xl text-gray-600">A compass that never drifts.</p>
        <p className="mt-2 max-w-2xl text-gray-500">
          In a world of spin and shifting narratives, Moral Clarity AI delivers answers anchored
          to eternal standards—clear, neutral, and unshakable.
        </p>

        <div className="mt-6 flex space-x-4">
          <a href="#problem" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700">
            Learn more
          </a>
          <a href="#updates" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100">
            Get updates
          </a>
        </div>

        <div className="mt-8 text-gray-400 text-sm flex space-x-6">
          <span>Neutral</span>
          <span>Anchored</span>
          <span>Red-teamed</span>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="min-h-screen flex flex-col justify-center px-6 py-20 bg-gray-50">
        <h2 className="text-3xl font-bold mb-4">The problem</h2>
        <p className="text-gray-600 max-w-3xl">
          We don’t lack information—we lack anchoring. Most systems don’t just present facts;
          they frame them. Trust erodes, drift increases, and decisions get nudged by hidden
          assumptions.
        </p>
      </section>

      {/* Updates Section */}
      <section id="updates" className="min-h-screen flex flex-col justify-center px-6 py-20">
        <h2 className="text-3xl font-bold mb-4">Get updates</h2>
        <p className="text-gray-600">Stay tuned for news and improvements to Moral Clarity AI.</p>
      </section>
    </div>
  );
}

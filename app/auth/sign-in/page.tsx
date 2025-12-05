  return (
    <div
      className="auth-card fixed top-10 right-10 
      w-full max-w-md bg-black/40 backdrop-blur-xl 
      border border-white/10 rounded-2xl p-8 shadow-xl"
    >
      <h1 className="text-3xl font-bold text-white mb-4">
        Sign in
      </h1>

      <p className="text-neutral-400 mb-6 text-sm">
        Enter your email to receive a secure magic link.
      </p>

      {sent ? (
        <div className="text-green-400 text-sm">
          ✨ Magic link sent — check your inbox.
        </div>
      ) : (
        <form onSubmit={signIn} className="space-y-4">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 
            text-white placeholder-neutral-500 focus:border-blue-500 
            focus:outline-none transition"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 
            to-cyan-500 text-white font-medium shadow-lg hover:scale-[1.02] 
            transition-transform"
          >
            Send magic link
          </button>
        </form>
      )}
    </div>
  );


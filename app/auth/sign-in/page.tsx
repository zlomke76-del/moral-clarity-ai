export default function SignIn() {
  return (
    <div className="auth-card w-full max-w-md">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">
        Sign in
      </h1>

      <p className="text-neutral-400 text-center mb-6 text-sm">
        Enter your email to receive a secure magic link.
      </p>

      <form className="space-y-4">
        <input
          required
          placeholder="you@example.com"
          type="email"
          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 
          text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 
          text-white font-medium shadow-lg hover:scale-[1.02] transition-transform"
        >
          Send magic link
        </button>
      </form>
    </div>
  );
}




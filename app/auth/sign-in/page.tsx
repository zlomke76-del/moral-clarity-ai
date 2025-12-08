// app/auth/sign-in/page.tsx
import { cookies } from "next/headers";

export default async function SignInPage() {
  const cookieStore = await cookies();

  // Prepare a clean placeholder for the callback to use later
  cookieStore.set("auth-callback-search", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Sign in to Moral Clarity AI
      </h1>

      <p className="text-neutral-400 text-sm text-center w-80">
        We’ll send you a secure magic link.
      </p>

      <form
        action="/auth/start"
        method="POST"
        className="flex flex-col gap-3 w-80"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="border rounded-lg px-3 py-2 text-black"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500"
        >
          Send Magic Link
        </button>
      </form>
    </main>
  );
}




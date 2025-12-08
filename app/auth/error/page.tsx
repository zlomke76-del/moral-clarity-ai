// app/auth/error/page.tsx
export default function AuthErrorPage({ searchParams }: any) {
  const err = searchParams?.err || "Unknown error";

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Sign-in Error</h1>
        <p>Something went wrong finishing your sign-in.</p>
        <p className="text-red-400">Technical details: {err}</p>

        <a href="/auth/sign-in" className="text-blue-400 underline">
          Back to Sign In
        </a>
      </div>
    </div>
  );
}

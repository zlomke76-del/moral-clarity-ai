// app/subscribe/page.tsx
import Link from "next/link";

const MARKETING_URL =
  process.env.NEXT_PUBLIC_MARKETING_URL ?? "https://www.moralclarityai.com/";

export default function Subscribe() {
  return (
    <main className="min-h-screen grid place-items-center bg-[#0B1422] text-white px-6">
      <div className="max-w-xl w-full bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
        <h1 className="text-2xl font-semibold">Thanks — you’re on the list!</h1>
        <p className="mt-3 text-white/80">
          We’ll be in touch soon with updates from <strong>Moral Clarity AI</strong>.
        </p>

        <div className="mt-6">
          <Link
            href={MARKETING_URL}
            className="inline-block rounded-md bg-[#F2C448] px-4 py-2 font-medium text-black hover:opacity-90"
          >
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}

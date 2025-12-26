import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice — Case Studies | Moral Clarity AI",
  description:
    "Documented short-cycle falsifications of real-world assumptions under minimal pressure. Binary outcomes. Fixed records.",
  openGraph: {
    title: "Edge of Practice — Case Studies",
    description:
      "Short-cycle falsifications where systems failed cleanly under real-world pressure.",
    url: "https://studio.moralclarity.ai/edge-of-practice/case-studies",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EdgeOfPracticeCaseStudiesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Edge of Practice — Case Studies</h1>

        <p>
          <strong>Documented short-cycle falsifications of real-world assumptions.</strong>
        </p>

        <p>
          This index records <em>Edge of Practice</em> case studies where an
          assumption failed cleanly under minimal, real-world pressure.
          These are not opinions, critiques, or postmortems.
          Each case documents a bounded test with a binary outcome.
        </p>

        <p>
          Case studies exist to preserve epistemic memory — especially where
          systems incorrectly self-certify trust, safety, or stewardship.
        </p>

        <hr />

        <h2>Published Case Studies</h2>

        <ul>
          <li>
            <Link href="/edge-of-practice/case-studies/grok-stewards-test">
              Failure of AI Self-Administration Under The Steward&apos;s Test (Grok)
            </Link>
          </li>

          <li>
            <Link href="/edge-of-practice/case-studies/copilot-stewards-test">
              Metaphorical Escape in AI Self-Assessment Under The Steward&apos;s Test (Copilot)
            </Link>
          </li>

          <li>
            <Link href="/edge-of-practice/case-studies/deepseek-stewards-test">
              Simulation-Execution Confusion and Protocol Substitution Under The Steward&apos;s Test (DeepSeek)
            </Link>
          </li>

          <li>
            <Link href="/edge-of-practice/case-studies/chatgpt-stewards-test">
              Narrated Hypothetical Compliance Under The Steward&apos;s Test (ChatGPT)
            </Link>
          </li>

          <li>
            <Link href="/edge-of-practice/case-studies/meta-stewards-test">
              Externally Scaffolded Stewardship Compliance Under The Steward&apos;s Test (Meta AI)
            </Link>
          </li>
        </ul>

        <hr />

        <p className="text-sm opacity-80">
          Case studies are fixed at publication and revised only by explicit
          versioning. Inclusion does not imply generalization beyond the tested
          assumption.
        </p>
      </article>
    </main>
  );
}

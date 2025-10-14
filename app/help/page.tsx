// app/help/page.tsx
"use client";

import { useState } from "react";

const faqs = [
  {
    section: "Getting Started",
    items: [
      {
        q: "What is Moral Clarity AI?",
        a: "A calm workspace for questions, reflection, and wise decisions—alone or with your family, team, or ministry."
      },
      {
        q: "How do I create a project?",
        a: "Go to Projects → New Project, name it, then use the tabs (Chat, Notes, Files, Briefs)."
      },
      {
        q: "What are Clarity Reports?",
        a: "Clarity Reports are dignified PDFs that summarize your project’s reflections and decisions."
      },
    ],
  },
  {
    section: "Plans & Billing",
    items: [
      {
        q: "Can I switch plans later?",
        a: "Yes. Upgrades apply immediately; downgrades take effect at the next billing cycle."
      },
      {
        q: "Do you offer trials?",
        a: "We offer a guided demo. Stewards may grant 30-day courtesy subscriptions at their discretion."
      },
      {
        q: "How do Ministry and 10% support work?",
        a: "10% support flows only to active ministries. If not active, funds accrue in escrow for up to 6 months before conversion."
      },
    ],
  },
  {
    section: "Privacy & Security",
    items: [
      {
        q: "Who can see my reflections?",
        a: "Only you, unless you share them inside a Family, Business, or Ministry workspace."
      },
      {
        q: "Do you sell data or run ads?",
        a: "No and no. We never sell personal data or run advertising."
      },
      {
        q: "Can I export my data?",
        a: "Yes—use Settings → Data & Privacy to export projects and Clarity Reports."
      },
    ],
  },
  {
    section: "Teams & Ministries",
    items: [
      {
        q: "How do I invite others?",
        a: "Stewards and Co-Stewards can invite via Hub → Invite. Invites expire in 7 days."
      },
      {
        q: "What if someone leaves?",
        a: "Revoke their seat (7-day grace), then reassign. Their personal reflections stay private."
      },
      {
        q: "Can ministries post weekly reflections?",
        a: "Yes. Ministry Feed supports posts and announcements; comments are off by default."
      },
    ],
  },
  {
    section: "Principles & Philosophy",
    items: [
      {
        q: "Why Truth · Reason · Stewardship · Peace?",
        a: "They are the north star for every feature and decision in Moral Clarity AI."
      },
      {
        q: "What is a Clarity Moment?",
        a: "A calm banner for meaningful updates—never noise or marketing."
      },
    ],
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-neutral">
      <h1>Help &amp; Frequently Asked Questions</h1>
      <p className="mb-8">
        If you can’t find what you need,{" "}
        <a href="mailto:support@moralclarity.ai">contact support</a>.
      </p>

      {faqs.map((section, sIdx) => (
        <section key={sIdx} className="mb-10">
          <h2>{section.section}</h2>
          <div className="divide-y divide-gray-300">
            {section.items.map((item, iIdx) => {
              const idx = Number(`${sIdx}${iIdx}`);
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left font-medium hover:text-indigo-600"
                  >
                    {item.q}
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-gray-700">{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}

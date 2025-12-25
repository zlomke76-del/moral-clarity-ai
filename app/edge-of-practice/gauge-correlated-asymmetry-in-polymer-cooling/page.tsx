import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Gauge-Correlated Asymmetry in Polymer Cooling | Edge of Practice — Moral Clarity AI",
  description:
    "A plant-ready falsification protocol exposing tolerated cooling symmetry assumptions in injection molding by correlating thermal asymmetry with measurable downstream defects.",
  openGraph: {
    title: "Gauge-Correlated Asymmetry in Polymer Cooling",
    description:
      "A steward-grade falsification protocol tying cooling-time assumptions directly to operational defects.",
    url: "https://studio.moralclarity.ai/edge-of-practice/gauge-correlated-asymmetry-in-polymer-cooling",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GaugeCorrelatedAsymmetryPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Gauge-Correlated Asymmetry in Polymer Cooling</h1>
        <p className="text-sm opacity-70">
          Edge of Practice · Steward’s Falsification Protocol
        </p>

        <h2>One-Sentence Assumption Under Test</h2>
        <p>
          Standard injection molding cooling times are sufficient to eliminate
          internal thermal asymmetry such that no repeatable downstream defect
          emerges in finished polypropylene parts.
        </p>

        <h2>Why This Assumption Is Tolerated</h2>
        <p>
          Fixed cooling times simplify cycle design and maximize throughput.
          Internal thermal gradients are difficult to measure without intrusive
          instrumentation, and post-process inspection often masks cooling-driven
          defects by averaging warpage, sink, or shrink within tolerance bands.
          Low rejection rates are treated as confirmation, allowing the
          assumption to persist without direct verification.
        </p>

        <h2>Minimal Plant-Ready Falsification Experiment</h2>

        <h3>Setup</h3>
        <ul>
          <li>
            Mold a standard polypropylene part (approximately 4&nbsp;mm nominal
            wall thickness) at steady state.
          </li>
          <li>
            Hold all parameters constant: material lot, melt temperature, mold
            temperature, and packing profile.
          </li>
          <li>
            Run three cooling-time conditions:
            <ul>
              <li>Nominal production cooling time</li>
              <li>Nominal minus 20 percent</li>
              <li>Nominal plus 20 percent</li>
            </ul>
          </li>
          <li>Produce 30 parts per condition.</li>
        </ul>

        <p>
          No invasive sensors, mold modifications, or specialized instrumentation
          are required.
        </p>

        <h2>Single Primary Readout</h2>
        <p>
          Select one downstream artifact metric appropriate to the part geometry
          and use it consistently across all conditions:
        </p>
        <ul>
          <li>Warpage magnitude and direction at fixed datums</li>
          <li>Sink depth at a defined rib or boss</li>
          <li>Shrink differential along flow versus transverse direction</li>
          <li>
            Optical haze or crystallinity banding under fixed lighting conditions
          </li>
        </ul>

        <h2>Pass / Fail Criteria</h2>
        <p>
          <strong>Pass:</strong> The artifact metric remains within specification
          and shows no systematic trend across cooling-time variation.
        </p>
        <p>
          <strong>Fail:</strong> A repeatable defect signature appears at nominal
          cooling time and shifts predictably with reduced or increased cooling
          time.
        </p>

        <h2>Embarrassing Flip Condition</h2>
        <p>
          A consistent warpage vector, sink location, or banding pattern appears
          at nominal settings and improves or worsens monotonically as cooling
          time is increased or decreased.
        </p>

        <h2>Corrected Interpretation if Flip Occurs</h2>
        <p>
          The nominal cooling time does not sufficiently eliminate internal
          thermal asymmetry. The assumption of uniform solidification is
          operationally invalid, and downstream defects are being tolerated
          rather than prevented.
        </p>

        <h2>Steward’s Note</h2>
        <p>
          This experiment does not aim to prove that internal thermal gradients
          exist. That is already known. It determines whether the chosen cooling
          time is sufficient to prevent those gradients from becoming
          load-bearing defects.
        </p>

        <p>
          By correlating asymmetry with an artifact the plant already measures,
          the test removes plausible deniability and forces accountability at the
          process level.
        </p>

        <h2>Canonical Principle</h2>
        <blockquote>
          <p>
            <strong>Gauge-Correlated Asymmetry Clause:</strong> A physical
            assumption is falsified not by noise, but by persistent asymmetry
            that correlates with a measurable downstream defect. Any symmetry
            claim that cannot survive contact with the product artifact is
            operationally void.
          </p>
        </blockquote>

        <hr />

        <p className="text-sm opacity-70">
          Part of the{" "}
          <Link href="/edge-of-practice">
            Edge of Practice short-cycle experiment index
          </Link>
          .
        </p>
      </article>
    </main>
  );
}

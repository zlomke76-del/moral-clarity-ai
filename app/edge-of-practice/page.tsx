import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice — Short-Cycle Experiments | Moral Clarity AI",
  description:
    "A complete public index of short-cycle, falsifiable experiments designed to test hidden assumptions governing health, materials, energy, automation, and everyday human environments.",
  openGraph: {
    title: "Edge of Practice — Short-Cycle Experiments",
    description:
      "An exhaustive index of short-cycle experiments surfacing hidden assumptions with direct human relevance.",
    url: "https://moralclarity.ai/edge-of-practice",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EdgeOfPracticeIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Edge of Practice</h1>

        <p className="lead">
          <strong>
            Short-cycle experiments that break false assumptions at human scale
          </strong>
        </p>

        <p>
          <em>Edge of Practice</em> is a public index of small, decisive
          experiments executable using standard laboratory tools, commodity
          materials, and short timelines. These experiments are not designed to
          optimize systems or invent products. They exist to test hidden
          assumptions governing health, safety, materials use, energy capture,
          automation, and daily human environments.
        </p>

        <p>
          Each experiment is intentionally bounded: it asks one precise
          question, defines a minimal setup, and specifies a binary failure
          condition. If the assumption fails, it fails cleanly. No extrapolation
          is implied.
        </p>

        <hr />

        <h2>Experiment Lifecycle</h2>

        <ul>
          <li>
            <strong>Short-Cycle</strong> — rapid falsification (this index)
          </li>
          <li>
            <Link href="/edge-of-practice/extended-cycle">Extended Cycle</Link>{" "}
            — durability, fatigue, and repetition after short-cycle survival
          </li>
          <li>
            <Link href="/edge-of-practice/persistence">Persistence</Link> —
            long-duration, time-dominated failure modes
          </li>
        </ul>

        <hr />

        <h2>Founding Principle</h2>

        <p>
          <em>Edge of Practice</em> sits downstream of{" "}
          <Link href="/edge-of-knowledge">Edge of Knowledge</Link>. Where Edge of
          Knowledge governs the limits of certainty, Edge of Practice governs
          where action can begin anyway—carefully, humbly, and with full
          epistemic accountability.
        </p>

        <ul>
          <li>Weeks, not years</li>
          <li>Binary outcomes, not gradients</li>
          <li>Human relevance without extrapolation</li>
          <li>No proprietary tools or methods</li>
          <li>Failure is as valuable as success</li>
        </ul>

        <hr />

        <h2>Complete Short-Cycle Experiment Index</h2>

        <h3>Automation, Cognition, and Control</h3>
        <ul>
          <li><Link href="/edge-of-practice/agentic-normalization-drift">Agentic Normalization Drift in Adaptive AI Systems</Link></li>
          <li><Link href="/edge-of-practice/alarm-parsing-collapse-threshold">The Alarm Parsing Collapse Threshold in Automated Medical Care</Link></li>
          <li><Link href="/edge-of-practice/autonomous-handoff-blackout">Irreversible Takeover Blackout Intervals in Autonomous Vehicle Handoffs</Link></li>
          <li><Link href="/edge-of-practice/irreversible-cognitive-dead-zones">Irreversible Cognitive Dead Zones in Human–Automation Handoffs</Link></li>
          <li><Link href="/edge-of-practice/irreversible-normalization-drift">Irreversible Normalization Drift in Human Feedback Systems</Link></li>
        </ul>

        <h3>Materials, Polymers, and Surface Effects</h3>
        <ul>
          <li><Link href="/edge-of-practice/antibiotic-resistance-gene-cleaning">Antibiotic Resistance Gene Persistence Under Cleaning Regimes</Link></li>
          <li><Link href="/edge-of-practice/compostable-packaging-microfragments">Compostable Packaging Microfragment Persistence</Link></li>
          <li><Link href="/edge-of-practice/glove-additive-leaching-alcohol-sanitizer">Glove Additive Leaching Under Alcohol Sanitizer Exposure</Link></li>
          <li><Link href="/edge-of-practice/hdpe-ldpe-interfacial-toughening">HDPE–LDPE Interfacial Toughening Limits</Link></li>
          <li><Link href="/edge-of-practice/hdpe-die-entrance-viscosity-melt-fracture">HDPE Die-Entrance Viscosity Stability and Melt Fracture Risk</Link></li>
          <li><Link href="/edge-of-practice/pc-abs-interfacial-microdamping">PC–ABS Interfacial Microdamping Under Vibration</Link></li>
          <li><Link href="/edge-of-practice/pc-pmma-scratch-resistance">PC–PMMA Scratch Resistance Degradation</Link></li>
          <li><Link href="/edge-of-practice/pe-paraffin-thermal-buffering">PE–Paraffin Thermal Buffering Limits</Link></li>
          <li><Link href="/edge-of-practice/ps-pdms-surface-lubricity">PS–PDMS Surface Lubricity Decay</Link></li>

          {/* ADDITIVE INSERT — NO REMOVALS */}
          <li>
            <Link href="/edge-of-practice/gauge-correlated-asymmetry-in-polymer-cooling">
              Gauge-Correlated Asymmetry in Polymer Cooling
            </Link>
          </li>
        </ul>

        <h3>Energy, Physics, and Passive Systems</h3>
        <ul>
          <li><Link href="/edge-of-practice/constructive-physics">Constructive Physics — Where Reality Still Has Gifts to Give</Link></li>
          <li><Link href="/edge-of-practice/phase-locked-capillary-oscillation">Phase-Locked Capillary Oscillation for Enhanced Solar Desalination</Link></li>
          <li><Link href="/edge-of-practice/radiative-tension-rectification">Radiative Tension Rectification for Passive Energy Storage</Link></li>
          <li><Link href="/edge-of-practice/spectral-boundary-layer-destabilization">Spectral Gradient–Induced Boundary Layer Destabilization for Enhanced Passive Evaporation</Link></li>
        </ul>

        <h3>Environment, Exposure, and Human Health</h3>
        <ul>
          <li><Link href="/edge-of-practice/air-ionizer-electrostatic-charge">Air Ionizer Electrostatic Charge Accumulation</Link></li>
          <li><Link href="/edge-of-practice/heavy-metal-remobilization-urban-soils">Heavy Metal Remobilization in Urban Soils</Link></li>
          <li><Link href="/edge-of-practice/hot-water-ph-metal-leaching">Hot Water pH–Driven Metal Leaching</Link></li>
          <li><Link href="/edge-of-practice/indoor-lighting-circadian-expression">Indoor Lighting Effects on Circadian Expression</Link></li>
          <li><Link href="/edge-of-practice/microplastics">Indoor Microplastic Accumulation Pathways</Link></li>
          <li><Link href="/edge-of-practice/uv-sterilization-shadows">UV Sterilization Shadow Persistence</Link></li>
          <li><Link href="/edge-of-practice/viral-viability-indoor-surfaces">Longevity of Viral Viability on Common Indoor Surfaces</Link></li>
          <li><Link href="/edge-of-practice/vitamin-loss-refrigerated-juice">Vitamin Loss in Refrigerated Juices</Link></li>
          <li><Link href="/edge-of-practice/sweat-driven-device-corrosion">Sweat-Driven Corrosion in Wearable Devices</Link></li>
        </ul>

        <hr />

        <h2>Governance</h2>

        <p>
          Edge of Practice does not claim solutions, policy outcomes, or product
          relevance. Its sole function is to surface reality where assumptions
          dominate behavior. Any downstream application must be independently
          justified and revalidated.
        </p>

        <p className="text-sm text-muted-foreground">
          This page is the authoritative index of all short-cycle experiments.
          Experiments are fixed at publication and revised only by explicit
          versioning to preserve epistemic continuity.
        </p>
      </article>
    </main>
  );
}

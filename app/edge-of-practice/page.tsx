import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice — Short-Cycle Experiments | Moral Clarity AI",
  description:
    "A public index of short-cycle, falsifiable experiments designed to test hidden assumptions governing health, materials, and everyday human environments.",
  openGraph: {
    title: "Edge of Practice — Short-Cycle Experiments",
    description:
      "Executable experiments that surface hidden assumptions with direct human relevance.",
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
          experiments that can be executed using standard laboratory tools,
          commodity materials, and short timelines. These experiments are not
          designed to optimize systems or invent products. They exist to test
          hidden assumptions that quietly govern health, safety, materials use,
          and daily human environments.
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
            <Link href="/edge-of-practice/extended-cycle">
              Extended Cycle
            </Link>{" "}
            — durability, fatigue, and repetition after short-cycle survival
          </li>
          <li>
            <Link href="/edge-of-practice/persistence">
              Persistence
            </Link>{" "}
            — long-duration, time-dominated failure modes
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

        <h2>Founding Experiments</h2>

        <ul>
          {/* FOUNDATIONAL CONSTRAINT CLUSTER */}

          <li>
            <Link href="/edge-of-practice/irreversible-cognitive-dead-zones">
              Irreversible Cognitive Dead Zones in Human–Automation Handoffs
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Identifies non-negotiable cognitive and temporal boundaries during
              automation handoff where safe human intervention becomes physically
              impossible
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/irreversible-normalization-drift">
              Irreversible Normalization Drift in Human Feedback Systems
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Reveals slow-time safety collapse driven by baseline erosion, where
              unsafe conditions become perceptually invisible before failure
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/agentic-normalization-drift">
              Agentic Normalization Drift in Adaptive AI Systems
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Identifies irreversible policy-space collapse in adaptive agents,
              eliminating corrigibility before external failure is observable
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/autonomous-handoff-blackout">
              Irreversible Takeover Blackout Intervals in Autonomous Vehicle Handoffs
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Demonstrates biologically enforced takeover intervals in mixed-control
              autonomous driving where human intervention cannot succeed
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/alarm-parsing-collapse-threshold">
              The Alarm Parsing Collapse Threshold in Automated Medical Care
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Identifies a cognitive saturation threshold in ICU and anesthetic alarm
              systems beyond which additional alerts reduce safety rather than improve it
            </span>
          </li>

          {/* CONSTRUCTIVE PHYSICS / POSITIVE-SUM INTERVENTIONS */}

          <li>
            <Link href="/edge-of-practice/phase-locked-capillary-oscillation">
              Phase-Locked Capillary Oscillation for Enhanced Solar Desalination
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether resonant excitation of capillary waves at the water–air
              interface can amplify evaporation beyond steady solar thermal limits
            </span>
          </li>

          {/* ORIGINAL FOUNDING EXPERIMENTS */}

          <li>
            <Link href="/edge-of-practice/viral-viability-indoor-surfaces">
              Longevity of Viral Viability on Common Indoor Surfaces
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether surface-deposited viruses lose infectivity as quickly
              as commonly assumed
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/sweat-driven-device-corrosion">
              Acceleration of Device Metal Corrosion Due to Human Sweat and Skin Oils
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Evaluates real-world corrosion under normal human handling
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/vitamin-loss-refrigerated-juice">
              Vitamin Content Loss in Home-Stored Fresh Juices
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Measures nutritional degradation under typical refrigeration
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/compostable-packaging-microfragments">
              Residual Microfragments from “Compostable” Packaging
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether compostable plastics fully degrade in home compost
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/antibiotic-resistance-gene-cleaning">
              Antibiotic Resistance Gene Spread After Household Cleaning
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Examines unintended microbial selection effects of cleaning
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/indoor-lighting-circadian-expression">
              Indoor Lighting Spectra and Circadian Gene Expression
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests biological neutrality of common indoor lighting
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/uv-sterilization-shadows">
              Pathogen Persistence in UV-Sterilized Equipment Shadows
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Identifies hidden sterilization failure zones
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/hot-water-ph-metal-leaching">
              Effect of Hot Water pH on Plumbing Metal Leaching
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests metal release under realistic household conditions
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/air-ionizer-electrostatic-charge">
              Air Ionizer Effects on Electrostatic Charge Buildup
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Evaluates unintended ESD risks from ionization
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/glove-additive-leaching-alcohol-sanitizer">
              Lab Glove Additive Leaching After Sanitizer Exposure
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests chemical integrity of gloves under real use
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/microplastics-dynamic-chemistry">
              Microplastics as Dynamic Chemical Agents
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether microplastics chemically alter surrounding water and
              sediment under ordinary environmental conditions
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/heavy-metal-remobilization-urban-soils">
              Heavy Metal Stability in Ordinary Urban Environments
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether chemically bound heavy metals remobilize under normal
              rainfall and drainage conditions
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/pp-pvp-hydration-capture">
              Hydration-Mediated Aerosol Capture in Polypropylene Fibers
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether interface-localized hydration layers improve particle
              capture in humid air without electrostatic charging
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/hdpe-ptfe-surface-energy">
              Surface Energy Control via PTFE Microdomains in HDPE
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether trace PTFE alters surface adhesion through physical
              energy contrast alone
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/pc-pmma-scratch-resistance">
              Scratch Resistance from Physical PMMA Dispersion in Polycarbonate
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether PMMA microdomains improve abrasion resistance without
              coatings or chemistry
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/pc-abs-interfacial-microdamping">
              Interfacial Micro-Damping in Layered PC/ABS Structures
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether compliance mismatch at a pure polymer interface
              increases fatigue resistance
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/pe-paraffin-thermal-buffering">
              Passive Thermal Buffering in Polyethylene Films
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether confined paraffin wax moderates heat rise rates in
              commodity polyethylene without leakage
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/ps-pdms-surface-lubricity">
              Low-Friction, Clear Surfaces via PDMS Migration in Polystyrene
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether trace PDMS creates durable, optically clear,
              low-friction PS surfaces without blooming or coatings
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/hdpe-ldpe-interfacial-toughening">
              Interfacial Toughening in HDPE via Dispersed LDPE Domains
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether LDPE inclusions increase mechanical toughness in HDPE
              through morphology alone
            </span>
          </li>
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
          Edge of Practice is a public research index. Experiments are fixed at
          publication and revised only by explicit versioning to preserve
          epistemic continuity.
        </p>
      </article>
    </main>
  );
}

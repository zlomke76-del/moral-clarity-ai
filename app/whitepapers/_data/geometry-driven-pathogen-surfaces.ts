import type { ConstraintPageData } from "../_components/constraint-types";

export const geometryDrivenPathogenSurfacesData: ConstraintPageData = {
  metadata: {
    title:
      "Geometry-Driven Pathogen-Hostile Surfaces | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether surface geometry alone can produce durable pathogen suppression. Final determination: NO-GO.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Geometry-Driven Pathogen-Hostile Surfaces",
    description:
      "Evaluation of whether surface geometry alone is admissible as a durable pathogen-suppression mechanism under real-world conditions.",
    status: "NO-GO",
  },

  systemConstraint: {
    statement:
      "Geometry-only antimicrobial claims are admissible only if suppression persists after wear, fouling, and environmental cycling.",
    substatement:
      "If suppression collapses under real-world conditions, the system is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "Geometry-based systems promise passive, non-toxic suppression without chemistry.",
      "That promise is meaningful only if suppression survives wear, fouling, and real-world degradation rather than controlled laboratory conditions.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "A surface whose antimicrobial effect derives solely from micro- or meso-scale geometry, without chemical or active mechanisms.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if durable suppression does not remain after realistic degradation conditions.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Wear, abrasion, organic fouling, wet-dry cycling, and mixed-species biofilm exposure against flat chemically matched controls.",
    passText:
      "Suppression persists after wear, fouling, and environmental cycling.",
    failText:
      "Suppression collapses under real-world conditions.",
  },

  determination:
    "Final determination: NO-GO. Geometry alone does not provide durable pathogen suppression under real-world conditions.",

  doctrine: {
    statement:
      "A system that only works before reality touches it does not work.",
    emphasisTop: "Ideal conditions do not define admissibility.",
  },
};

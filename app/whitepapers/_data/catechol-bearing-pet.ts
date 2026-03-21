import type { ConstraintPageData } from "../_components/constraint-types";

export const catecholBearingPetData: ConstraintPageData = {
  metadata: {
    title:
      "Catechol-Bearing PET | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether adhesion remains structurally retained under environmental cycling.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Catechol-Bearing PET",
    description:
      "Evaluation of whether adhesion can be structurally retained in PET and persist across wet/dry environmental cycling without reliance on mobile adhesives or transient surface chemistry.",
    status: "CONDITIONAL",
  },

  // 🔥 NEW — this is where system intelligence lives
  constraintType: "INTERFACE",

  systemConstraint: {
    statement:
      "Adhesion is admissible only if it persists under environmental cycling as a function of retained structure.",
    substatement:
      "If bonding degrades or depends on transient surface chemistry, the system is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "Conventional adhesion systems rely on applied adhesives, coatings, or treatments that degrade under environmental stress.",
      "Structural anchoring offers a pathway to intrinsic adhesion without external bonding agents.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "Catechol-functional monomers are incorporated into PET during polymerization to embed adhesion-capable functionality into the structure.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if adhesion strength decreases beyond threshold after repeated wet/dry cycling or if functional groups degrade.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Surface peel testing after repeated wet/dry cycles defines adhesion persistence.",
    passText:
      "Adhesion loss remains within 10% of baseline.",
    failText:
      "Greater than 10% reduction in adhesion strength.",
  },

  determination:
    "Admissibility is conditional on adhesion persistence under cycling. Adhesion claims are invalid if bonding degrades with use.",

  doctrine: {
    statement:
      "If adhesion does not survive the interface, it is not part of the material.",
    emphasisTop: "Bonding must persist.",
    emphasisBottom: "Not just occur.",
  },
};

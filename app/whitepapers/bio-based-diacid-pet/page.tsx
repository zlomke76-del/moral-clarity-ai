import type { ConstraintPageData } from "../_components/constraint-types";

export const bioBasedDiacidPetData: ConstraintPageData = {
  metadata: {
    title:
      "Bio-Based Diacid PET (FDCA) | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether FDCA can be structurally retained in PET as a durable renewable substitution.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Bio-Based Diacid PET (FDCA)",
    description:
      "Evaluation of whether FDCA can serve as a structurally retained renewable diacid within PET without loss of material integrity.",
    status: "CONDITIONAL",
  },

  systemConstraint: {
    statement:
      "Renewable substitution is admissible only if FDCA-derived structure remains structurally retained after extraction.",
    substatement:
      "If the renewable component does not persist, the claim is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "PET relies on fossil-derived feedstocks. FDCA offers a bio-based alternative, but substitution is only meaningful if structurally retained.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "FDCA is incorporated during PET polycondensation as a co-diacid, forming a partially renewable polyester system.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if furan-derived structure is not retained after extraction.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Soxhlet extraction followed by NMR quantification of furan-ring retention.",
    passText: "≥90% furan structure retained.",
    failText: "<90% retention after extraction.",
  },

  determination:
    "Admissibility is conditional on structural retention of FDCA. Renewable claims are invalid if retention fails.",

  doctrine: {
    statement:
      "If the renewable structure does not remain, the material is not meaningfully renewable.",
    emphasisTop: "Sustainability is structural.",
    emphasisBottom: "Not symbolic.",
  },
};

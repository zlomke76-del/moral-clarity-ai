import type { ConstraintPageData } from "../_components/constraint-types";

export const cyanateEsterPetData: ConstraintPageData = {
  metadata: {
    title:
      "Cyanate Ester–PET Copolymer | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether aromatic cyanate ester functionality can be structurally retained under high-temperature exposure.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Cyanate Ester–PET Copolymer",
    description:
      "Evaluation of whether aromatic cyanate ester functionality can be structurally incorporated into PET to improve thermal durability without functional loss under high-temperature exposure.",
    status: "CONDITIONAL",
  },

  // 🔥 KEY ADDITION
  constraintType: "PERSISTENCE",

  systemConstraint: {
    statement:
      "Thermal durability is admissible only if cyanate-derived structure remains intact after high-temperature exposure.",
    substatement:
      "If functionality degrades under heat, the system is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "PET performance degrades under elevated temperatures, limiting use in transportation, electronics, and infrastructure systems.",
      "Existing approaches rely on fillers and coatings, introducing complexity and failure modes.",
      "Structural modification offers a path to intrinsic heat resistance.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "Aromatic cyanate ester monomers are introduced at low molar fractions during PET synthesis to form thermally stable triazine structures.",
      "This is a constrained structural pathway requiring retention validation.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if cyanate-derived functionality degrades or is lost under thermal exposure, as indicated by reduction in IR spectral features.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Thermal exposure at 250°C for 1 hour followed by IR analysis to quantify retained functionality.",
    passText:
      "≥90% functional retention under thermal stress.",
    failText:
      ">10% functional loss after exposure.",
  },

  determination:
    "Admissibility is conditional on functional retention under thermal stress. Thermal performance claims are invalid if structural retention fails.",

  doctrine: {
    statement:
      "If the structure does not survive heat, the material does not gain thermal durability.",
    emphasisTop: "Temperature does not test performance.",
    emphasisBottom: "It reveals structure.",
  },
};

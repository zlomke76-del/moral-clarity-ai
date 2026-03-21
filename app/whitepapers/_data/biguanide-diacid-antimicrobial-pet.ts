import type { ConstraintPageData } from "../_components/constraint-types";

export const biguanideDiacidAntimicrobialPetData: ConstraintPageData = {
  metadata: {
    title:
      "Biguanide-Functional Antimicrobial PET | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether antimicrobial functionality is structurally retained in PET without dependence on leaching.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Biguanide-Functional Antimicrobial PET",
    description:
      "Evaluation of whether antimicrobial behavior can be structurally anchored in PET without reliance on leaching or mobile additives.",
    status: "CONDITIONAL",
  },

  constraintType: "OWNERSHIP",

  systemConstraint: {
    statement:
      "Antimicrobial function is admissible only if it remains after extraction as a property of the material itself.",
    substatement:
      "If activity depends on extractable species, the system is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "Conventional antimicrobial systems rely on mobile active agents, leading to depletion, migration, and loss of function over time.",
      "Structural anchoring offers a potential path to persistent activity without release-based mechanisms.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "Biguanide-functional diacids are incorporated during PET synthesis to create covalently anchored antimicrobial sites.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if antimicrobial activity diminishes after extraction or if functional groups are lost.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Soxhlet extraction followed by antimicrobial assay and functional retention analysis.",
    passText:
      "Activity persists with ≥90% functional retention and no leaching.",
    failText:
      "Activity declines or depends on extractable species.",
  },

  determination:
    "Admissibility is conditional on antimicrobial persistence without extractable contribution. Claims are invalid if function depends on release.",

  doctrine: {
    statement:
      "If activity depends on what leaves, it was never part of the material.",
    emphasisTop: "Function must be owned.",
    emphasisBottom: "Not borrowed.",
  },
};

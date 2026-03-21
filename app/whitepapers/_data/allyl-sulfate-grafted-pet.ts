import type { ConstraintPageData } from "../_components/constraint-types";

export const allylSulfateGraftedPetData: ConstraintPageData = {
  metadata: {
    title:
      "Allyl Sulfate Grafted PET | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether sulfate functionality can be structurally retained in PET under extraction stress.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Allyl Sulfate Grafted PET",
    description:
      "Evaluation of whether sulfate-bearing functionality can be covalently anchored to PET and remain structurally retained under extraction conditions relevant to filtration and ion-exchange use.",
    status: "CONDITIONAL",
  },

  systemConstraint: {
    statement:
      "Charge-based functionality is admissible only if sulfate groups remain structurally retained after extraction stress.",
    substatement:
      "If sulfur-bearing functionality is lost, the system is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "Many filtration and ion-exchange systems rely on mobile or weakly retained functional species, leading to performance decay through leaching or degradation.",
      "Structural anchoring offers a path to persistent charge without dependence on extractable chemistry.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "Allyl sulfate grafting via controlled melt processing introduces sulfate-bearing functionality covalently onto PET chain sites.",
      "This is a constrained structural hypothesis requiring retention validation.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if sulfur-bearing functionality is lost under extraction conditions.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Soxhlet extraction followed by sulfur quantification defines the governing evaluation.",
    passText: "≥90% sulfur retained after extraction.",
    failText: ">10% sulfur loss after extraction.",
  },

  determination:
    "Admissibility is conditional on sulfate retention under extraction. Filtration or ion-exchange claims are invalid if structural retention fails.",

  doctrine: {
    statement:
      "If the charge does not remain, the material is not charged.",
    emphasisTop: "Extraction reveals structure.",
    emphasisBottom: "Not performance.",
  },
};

import type { ConstraintPageData } from "../_components/constraint-types";

export const carboxylicAcidModifiedPetData: ConstraintPageData = {
  metadata: {
    title:
      "Carboxylic Acid–Modified PET | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether pendant carboxylic acid functionality can be durably incorporated into PET to improve chemical resistance.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Carboxylic Acid–Modified PET",
    description:
      "Evaluation of whether pendant carboxylic acid functionality can be structurally incorporated into PET to improve chemical resistance without reliance on extractable additives.",
    status: "CONDITIONAL",
  },

  constraintType: "RETENTION",

  systemConstraint: {
    statement:
      "Chemical resistance is admissible only if carboxylic acid functionality remains structurally retained after extraction stress.",
    substatement:
      "If functionality is not retained, observed performance is not structural.",
  },

  context: {
    title: "Problem Context",
    body: [
      "PET is widely used in chemically exposed environments, where degradation and interaction can compromise integrity.",
      "Existing solutions introduce coatings, additives, and failure pathways. Structural modification offers a potential alternative.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "Dicarboxylic acid monomers with pendant functionality are incorporated during melt polycondensation to embed acid groups into the polymer backbone.",
      "This is a constrained structural pathway requiring retention validation.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if pendant acid functionality is not retained after extraction or if loss reduces structural contribution below threshold.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Soxhlet water extraction followed by acid titration to quantify retained functionality.",
    passText:
      "≥90% retention of pendant acid functionality with no extractables.",
    failText:
      "<90% retention or evidence of extractable functionality.",
  },

  determination:
    "Admissibility is conditional on structural retention. Performance claims are invalid if retention fails.",

  doctrine: {
    statement:
      "If the modifying structure does not remain, the improvement does not belong to the material.",
    emphasisTop:
      "Chemical resistance requires structural persistence.",
  },
};

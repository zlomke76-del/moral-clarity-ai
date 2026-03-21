import type { ConstraintPageData } from "../_components/constraint-types";

export const edtaLigandFunctionalPetData: ConstraintPageData = {
  metadata: {
    title:
      "EDTA-Ligand Functional PET | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether heavy-metal binding remains structurally retained across repeated capture–release cycles.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "EDTA-Ligand Functional PET",
    description:
      "Evaluation of whether heavy-metal binding can remain structurally retained and repeatable across multiple capture–release cycles without reliance on leaching or consumable chemistry.",
    status: "CONDITIONAL",
  },

  // 🔥 KEY — this is the defining class
  constraintType: "REPEATABILITY",

  systemConstraint: {
    statement:
      "Remediation is admissible only if binding capacity persists across repeated cycles as a function of retained structure.",
    substatement:
      "If capacity degrades with use or depends on extractable species, the system is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "Heavy-metal remediation systems often rely on consumable or soluble chelating agents, leading to depletion and environmental release.",
      "Structural anchoring offers a path to reusable, non-leaching systems.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "EDTA-like ligand structures are incorporated into PET during polymerization to create fixed chelation sites within the material.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if binding capacity decreases measurably across repeated capture–release cycles or if ligand functionality is lost.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Repeated binding and release cycles with quantitative measurement of retained capacity.",
    passText:
      "Binding capacity remains stable across ≥5 cycles.",
    failText:
      "Measurable loss of capacity across cycles.",
  },

  determination:
    "Admissibility is conditional on repeatable binding without degradation. Remediation claims are invalid if capacity declines with use.",

  doctrine: {
    statement:
      "If function does not persist through use, it is not owned by the material.",
    emphasisTop: "Reuse reveals structure.",
    emphasisBottom: "Not performance.",
  },
};

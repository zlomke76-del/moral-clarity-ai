import type { ConstraintPageData } from "../_components/constraint-types";

export const citricAcidModifiedPetData: ConstraintPageData = {
  metadata: {
    title:
      "Citric Acid–Modified PET | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether citric-derived functionality enables controlled, structurally governed hydrolytic response in PET.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Citric Acid–Modified PET",
    description:
      "Evaluation of whether citric-derived functionality can enable controlled hydrolytic susceptibility governed by retained structure rather than uncontrolled degradation or additive behavior.",
    status: "CONDITIONAL",
  },

  systemConstraint: {
    statement:
      "Hydrolytic susceptibility is admissible only if it is controlled by structurally retained citric-derived functionality.",
    substatement:
      "If response is uncontrolled or decoupled from structure, the system is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "PET durability limits controlled end-of-life behavior, while additive approaches introduce variability and loss of structural control.",
      "Structural modification offers a pathway to predictable hydrolytic response without compromising in-use stability.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "Citric-acid-derived triacid functionality is incorporated during PET polycondensation to introduce controlled hydrolytic response points.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if citric-derived functionality is lost or if hydrolytic response becomes unpredictable or decoupled from structure.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Neutral water immersion at 80°C for 7 days followed by quantification of retained acid functionality and response consistency.",
    passText:
      "Structural retention with predictable, condition-dependent response.",
    failText:
      "Loss of structure or uncontrolled degradation behavior.",
  },

  determination:
    "Admissibility is conditional on structural retention and predictable hydrolytic response. Claims are invalid if behavior is uncontrolled.",

  doctrine: {
    statement:
      "Degradation is admissible only if it is controlled by structure.",
    emphasisTop: "If behavior cannot be predicted,",
    emphasisBottom: "it is not governed by the material.",
  },
};

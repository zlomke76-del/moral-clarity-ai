import type { ConstraintPageData } from "../_components/constraint-types";

export const epoxyModifiedPetData: ConstraintPageData = {
  metadata: {
    title:
      "Epoxy-Modified PET | Constraint Assessment | Moral Clarity AI",
    description:
      "A constraint-bound evaluation of whether epoxy functionality can remain structurally stable under hydrolytic stress.",
    robots: { index: true, follow: true },
  },

  hero: {
    title: "Epoxy-Modified PET",
    description:
      "Evaluation of whether epoxy-functional diacids can be structurally incorporated into PET to enable durable adhesion and barrier performance without functional loss under chemical stress.",
    status: "CONDITIONAL",
  },

  constraintType: "PERSISTENCE",

  systemConstraint: {
    statement:
      "Adhesion and barrier enhancement are admissible only if epoxy functionality remains structurally intact under hydrolytic stress.",
    substatement:
      "If epoxy groups degrade under chemical exposure, the system is rejected.",
  },

  context: {
    title: "Problem Context",
    body: [
      "PET adhesion and barrier performance are often enhanced through coatings or multilayer systems, introducing complexity and failure pathways.",
      "Structural modification offers a route to intrinsic performance without external systems.",
    ],
  },

  construction: {
    title: "System Construction",
    body: [
      "Glycidyl-functional diacids are incorporated into PET during polycondensation to embed epoxy functionality within the polymer structure.",
    ],
  },

  failureCondition: {
    title: "Failure Condition",
    body: [
      "The system fails if epoxy functionality is lost or degraded under hydrolytic exposure.",
    ],
  },

  admissibilityTest: {
    title: "Admissibility Test",
    description:
      "Exposure to 1M HCl for 24 hours followed by quantification of retained epoxy groups.",
    passText:
      "≥90% epoxy functionality retained.",
    failText:
      "<90% retention after hydrolysis.",
  },

  determination:
    "Admissibility is conditional on epoxy retention under chemical stress. Adhesion and barrier claims are invalid if structural survivability fails.",

  doctrine: {
    statement:
      "If the reactive structure does not survive chemistry, the material does not gain function.",
    emphasisTop: "Chemistry does not enhance structure.",
    emphasisBottom: "It tests it.",
  },
};

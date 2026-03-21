import type { Metadata } from "next";

export type ConstraintStatus = "CONDITIONAL" | "NO-GO" | "PASS" | "FAIL";

export type ConstraintType =
  | "RETENTION"
  | "CHARGE_RETENTION"
  | "OWNERSHIP"
  | "PERSISTENCE"
  | "TRAJECTORY"
  | "INTERFACE"
  | "MULTI_DOMAIN"
  | "CLAIM"
  | "REPEATABILITY"
  | "NO_GO";

export type ConstraintHero = {
  title: string;
  eyebrow?: string;
  description: string;
  status: ConstraintStatus;
};

export type ConstraintSection = {
  title: string;
  body: string[];
};

export type ConstraintTest = {
  title?: string;
  description: string;
  passLabel?: string;
  passText: string;
  failLabel?: string;
  failText: string;
};

export type ConstraintPageData = {
  metadata: Metadata;
  hero: ConstraintHero;
  constraintType: ConstraintType;
  systemConstraint: {
    statement: string;
    substatement: string;
  };
  context: ConstraintSection;
  construction: ConstraintSection;
  failureCondition: {
    title?: string;
    body: string[];
  };
  admissibilityTest: ConstraintTest;
  determination: string;
  doctrine: {
    statement: string;
    emphasisTop?: string;
    emphasisBottom?: string;
  };
};

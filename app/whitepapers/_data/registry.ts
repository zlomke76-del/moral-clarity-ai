// app/whitepapers/_data/registry.ts
// ============================================================
// WHITE PAPERS REGISTRY
// Source of truth for index navigation, grouping, and metadata
// ============================================================

export type WhitePaperStatus = "CONDITIONAL" | "NO-GO" | "PASS" | "FAIL";

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

export type LibrarySectionKey =
  | "conceptual"
  | "core-pet"
  | "extended-pet"
  | "frontier";

export type WhitePaperRegistryItem = {
  slug: string;
  title: string;
  subtitle: string;
  section: LibrarySectionKey;
  constraintType: ConstraintType;
  status: WhitePaperStatus;
};

export const LIBRARY_SECTION_META: Record<
  LibrarySectionKey,
  {
    eyebrow: string;
    title: string;
    description: string;
    order: number;
  }
> = {
  conceptual: {
    eyebrow: "Conceptual Papers",
    title: "Conceptual Papers",
    description:
      "Research framing physical, ethical, and epistemic boundaries before materials, systems, or interventions are treated as operationally real.",
    order: 1,
  },
  "core-pet": {
    eyebrow: "Core PET Systems",
    title: "Core PET White Papers",
    description:
      "Core constrained PET systems focused on covalent retention, durability-gated function, extraction stability, and foundational performance behavior.",
    order: 2,
  },
  "extended-pet": {
    eyebrow: "Extended PET Systems",
    title: "Extended PET Architectures",
    description:
      "Extended PET candidates exploring renewable feedstocks, antimicrobial surfaces, chelation, adhesion, antioxidant behavior, and other broadened functional architectures.",
    order: 3,
  },
  frontier: {
    eyebrow: "Frontier Systems",
    title: "Frontier Material Behaviors",
    description:
      "Material systems where the behavioral class changes from static function to dynamic response, including self-healing and solid-state capture behavior.",
    order: 4,
  },
};

export const CONSTRAINT_TYPE_META: Record<
  ConstraintType,
  {
    label: string;
    order: number;
  }
> = {
  RETENTION: {
    label: "Retention",
    order: 1,
  },
  CHARGE_RETENTION: {
    label: "Charge Retention",
    order: 2,
  },
  OWNERSHIP: {
    label: "Functional Ownership",
    order: 3,
  },
  PERSISTENCE: {
    label: "Persistence",
    order: 4,
  },
  TRAJECTORY: {
    label: "Trajectory Control",
    order: 5,
  },
  INTERFACE: {
    label: "Interfacial Stability",
    order: 6,
  },
  MULTI_DOMAIN: {
    label: "Multi-Domain",
    order: 7,
  },
  CLAIM: {
    label: "Claim Integrity",
    order: 8,
  },
  REPEATABILITY: {
    label: "Repeatability",
    order: 9,
  },
  NO_GO: {
    label: "No-Go",
    order: 10,
  },
};

export const WHITE_PAPER_REGISTRY: WhitePaperRegistryItem[] = [
  // ==========================================================
  // CONCEPTUAL
  // ==========================================================
  {
    slug: "materials-with-causal-memory",
    title: "Materials with Causal Memory",
    subtitle:
      "Physical systems that irreversibly encode history, exposure, or misuse into material structure.",
    section: "conceptual",
    constraintType: "CLAIM",
    status: "CONDITIONAL",
  },
  {
    slug: "geometry-driven-pathogen-surfaces",
    title: "Geometry-Driven Pathogen Surfaces",
    subtitle:
      "How surface geometry alone can influence pathogen behavior without chemistry or claims of elimination.",
    section: "conceptual",
    constraintType: "NO_GO",
    status: "NO-GO",
  },
  {
    slug: "passive-aerosol-suppression",
    title: "Passive Aerosol Suppression",
    subtitle:
      "Regime-bounded evaluation of materials that reduce aerosol transmission without filtration or airflow control.",
    section: "conceptual",
    constraintType: "NO_GO",
    status: "NO-GO",
  },
  {
    slug: "passive-environmental-witnesses",
    title: "Passive Environmental Witnesses",
    subtitle:
      "Materials that record environmental exposure as physical evidence rather than data or reports.",
    section: "conceptual",
    constraintType: "CLAIM",
    status: "CONDITIONAL",
  },
  {
    slug: "passive-source-control",
    title: "Passive Source Control",
    subtitle:
      "Reducing emitted harm at the source through intrinsic material behavior, not user compliance.",
    section: "conceptual",
    constraintType: "NO_GO",
    status: "NO-GO",
  },
  {
    slug: "phase-selective-cooling",
    title: "Phase-Selective Cooling",
    subtitle:
      "Thermal regulation through phase behavior rather than active energy expenditure.",
    section: "conceptual",
    constraintType: "MULTI_DOMAIN",
    status: "CONDITIONAL",
  },

  // ==========================================================
  // CORE PET
  // ==========================================================
  {
    slug: "sulfonated-aromatic-diacid-pet",
    title: "Sulfonated Aromatic Diacid–PET Copolymer",
    subtitle:
      "Anchored fixed-charge PET with durability-gated hygiene capability.",
    section: "core-pet",
    constraintType: "CHARGE_RETENTION",
    status: "CONDITIONAL",
  },
  {
    slug: "phosphonate-diol-pet",
    title: "Phosphonate-Diol–PET Copolymer",
    subtitle: "Covalently retained phosphonate PET for non-leaching flame retardancy.",
    section: "core-pet",
    constraintType: "OWNERSHIP",
    status: "CONDITIONAL",
  },
  {
    slug: "carboxylic-acid-modified-pet",
    title: "Carboxylic Acid–Modified PET",
    subtitle: "Pendant-acid PET for enhanced chemical resistance and container life.",
    section: "core-pet",
    constraintType: "RETENTION",
    status: "CONDITIONAL",
  },
  {
    slug: "quaternary-ammonium-grafted-pet",
    title: "Quaternary Ammonium–Grafted PET",
    subtitle: "Extraction-stable cationic PET surfaces with antimicrobial potential.",
    section: "core-pet",
    constraintType: "OWNERSHIP",
    status: "CONDITIONAL",
  },
  {
    slug: "peg-diacid-pet",
    title: "PEG-Diacid PET Copolymer",
    subtitle: "Hydration-stable PEG incorporation for flexible, biocompatible PET.",
    section: "core-pet",
    constraintType: "PERSISTENCE",
    status: "CONDITIONAL",
  },
  {
    slug: "imidazolium-functional-pet",
    title: "Imidazolium-Functional PET Graft",
    subtitle: "Salt-stable ionic PET for membranes and sensing.",
    section: "core-pet",
    constraintType: "PERSISTENCE",
    status: "CONDITIONAL",
  },
  {
    slug: "zwitterion-modified-pet",
    title: "Zwitterion-Modified PET",
    subtitle: "Anti-fouling PET surfaces gated by hot-water extraction stability.",
    section: "core-pet",
    constraintType: "PERSISTENCE",
    status: "CONDITIONAL",
  },
  {
    slug: "cyanate-ester-pet",
    title: "Cyanate Ester–PET Copolymer",
    subtitle: "Thermally durable PET via low-level cyanate anchoring.",
    section: "core-pet",
    constraintType: "PERSISTENCE",
    status: "CONDITIONAL",
  },
  {
    slug: "allyl-sulfate-grafted-pet",
    title: "Allyl Sulfate Grafted PET",
    subtitle: "Anchored sulfate PET for filtration and ion-exchange applications.",
    section: "core-pet",
    constraintType: "CHARGE_RETENTION",
    status: "CONDITIONAL",
  },
  {
    slug: "epoxy-modified-pet",
    title: "Epoxy-Modified PET",
    subtitle: "Epoxy-diacid PET enabling adhesion and barrier enhancement.",
    section: "core-pet",
    constraintType: "PERSISTENCE",
    status: "CONDITIONAL",
  },

  // ==========================================================
  // EXTENDED PET
  // ==========================================================
  {
    slug: "bio-based-diacid-pet",
    title: "Bio-Based Diacid PET Copolymer (FDCA)",
    subtitle: "Renewable diacid PET supporting lower-carbon polymer supply chains.",
    section: "extended-pet",
    constraintType: "CLAIM",
    status: "CONDITIONAL",
  },
  {
    slug: "biguanide-diacid-antimicrobial-pet",
    title: "Biguanide Diacid–Functional Antimicrobial PET",
    subtitle: "Anchored antimicrobial PET without leachable additives.",
    section: "extended-pet",
    constraintType: "OWNERSHIP",
    status: "CONDITIONAL",
  },
  {
    slug: "citric-acid-modified-pet",
    title: "Citric Acid–Modified PET",
    subtitle:
      "Controlled hydrolytic susceptibility enabling predictable end-of-life pathways.",
    section: "extended-pet",
    constraintType: "TRAJECTORY",
    status: "CONDITIONAL",
  },
  {
    slug: "gallic-acid-antioxidant-pet",
    title: "Gallic Acid–Antioxidant PET",
    subtitle: "Intrinsic antioxidant PET for extended shelf life and stability.",
    section: "extended-pet",
    constraintType: "PERSISTENCE",
    status: "CONDITIONAL",
  },
  {
    slug: "edta-ligand-functional-pet",
    title: "EDTA-Ligand Functional PET",
    subtitle: "Covalently anchored chelation for heavy-metal remediation.",
    section: "extended-pet",
    constraintType: "REPEATABILITY",
    status: "CONDITIONAL",
  },
  {
    slug: "catechol-bearing-pet",
    title: "Catechol-Bearing PET",
    subtitle: "Adhesion-enhanced PET inspired by mussel chemistry.",
    section: "extended-pet",
    constraintType: "INTERFACE",
    status: "CONDITIONAL",
  },
  {
    slug: "lignin-derived-aromatic-pet",
    title: "Lignin-Derived Aromatic PET Copolymer",
    subtitle: "Renewable aromatics from bio-refinery waste streams.",
    section: "extended-pet",
    constraintType: "CLAIM",
    status: "CONDITIONAL",
  },
  {
    slug: "ionic-liquid-antistatic-pet",
    title: "Ionic Liquid–Mimic Antistatic PET",
    subtitle: "Durable antistatic PET without migrating additives.",
    section: "extended-pet",
    constraintType: "MULTI_DOMAIN",
    status: "CONDITIONAL",
  },

  // ==========================================================
  // FRONTIER
  // ==========================================================
  {
    slug: "self-healing-diels-alder-pet",
    title: "Self-Healing PET via Diels–Alder Chemistry",
    subtitle: "Dynamic covalent PET enabling crack repair and life extension.",
    section: "frontier",
    constraintType: "REPEATABILITY",
    status: "CONDITIONAL",
  },
  {
    slug: "polyamine-co2-capture-pet",
    title: "Polyamine-Functional PET for CO₂ Capture",
    subtitle:
      "Solid-state CO₂ capture from concentrated streams or controlled air-contact systems.",
    section: "frontier",
    constraintType: "REPEATABILITY",
    status: "CONDITIONAL",
  },
];

export function getAllWhitePapers() {
  return [...WHITE_PAPER_REGISTRY];
}

export function getPapersBySection() {
  const grouped: Record<LibrarySectionKey, WhitePaperRegistryItem[]> = {
    conceptual: [],
    "core-pet": [],
    "extended-pet": [],
    frontier: [],
  };

  for (const paper of WHITE_PAPER_REGISTRY) {
    grouped[paper.section].push(paper);
  }

  for (const key of Object.keys(grouped) as LibrarySectionKey[]) {
    grouped[key].sort((a, b) => a.title.localeCompare(b.title));
  }

  return grouped;
}

export function getConstraintTypeCounts() {
  const counts = new Map<ConstraintType, number>();

  for (const paper of WHITE_PAPER_REGISTRY) {
    counts.set(paper.constraintType, (counts.get(paper.constraintType) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([type, count]) => ({
      type,
      label: CONSTRAINT_TYPE_META[type].label,
      count,
      order: CONSTRAINT_TYPE_META[type].order,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getStatusCounts() {
  const counts = new Map<WhitePaperStatus, number>();

  for (const paper of WHITE_PAPER_REGISTRY) {
    counts.set(paper.status, (counts.get(paper.status) ?? 0) + 1);
  }

  return {
    conditional: counts.get("CONDITIONAL") ?? 0,
    noGo: counts.get("NO-GO") ?? 0,
    pass: counts.get("PASS") ?? 0,
    fail: counts.get("FAIL") ?? 0,
  };
}

#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import ShadowSnapshotDiffService from "./shadowSnapshotDiffService";
import ShadowInspectionService, {
  InspectionReport,
} from "./shadowInspectionService";

/* ------------------------------------------------------------
   Environment
------------------------------------------------------------ */

const SHADOW_REPO_PATH = process.env.SHADOW_REPO_PATH;

if (!SHADOW_REPO_PATH) {
  console.error("SHADOW_REPO_PATH must be defined");
  process.exit(1);
}

const SNAPSHOT_ROOT = path.join(SHADOW_REPO_PATH, ".snapshots");
const REVIEW_ROOT = path.join(SHADOW_REPO_PATH, ".reviews");

if (!fs.existsSync(REVIEW_ROOT)) {
  fs.mkdirSync(REVIEW_ROOT, { recursive: true });
}

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

function loadInspectionReport(
  fromSnapshot: string,
  toSnapshot: string
): InspectionReport {
  const reportPath = path.join(
    SNAPSHOT_ROOT,
    toSnapshot,
    "inspection-report.json"
  );

  if (!fs.existsSync(reportPath)) {
    throw new Error("Inspection report not found for snapshot " + toSnapshot);
  }

  return JSON.parse(fs.readFileSync(reportPath, "utf8"));
}

/* ------------------------------------------------------------
   Main
------------------------------------------------------------ */

(async () => {
  const fromSnapshot = await prompt("From snapshot ID: ");
  const toSnapshot = await prompt("To snapshot ID: ");

  const diffService = new ShadowSnapshotDiffService(SHADOW_REPO_PATH);
  const diff = diffService.diffSnapshots(fromSnapshot, toSnapshot);

  console.log("\n=== DIFF SUMMARY ===");
  console.log(diff.summary);
  console.log("\nAdded:", diff.added.length);
  console.log("Removed:", diff.removed.length);
  console.log("Modified:", diff.modified.length);

  const inspection = loadInspectionReport(fromSnapshot, toSnapshot);

  console.log("\n=== INSPECTION SUMMARY ===");
  console.log(inspection.summary);

  for (const finding of inspection.findings) {
    console.log(
      `- [${finding.severity.toUpperCase()}] ${finding.message} (${finding.inspector})`
    );
    if (finding.filePaths) {
      finding.filePaths.forEach(p => console.log("   •", p));
    }
  }

  const decision = await prompt(
    "\nDecision (approve / reject / defer): "
  );

  if (!["approve", "reject", "defer"].includes(decision)) {
    console.error("Invalid decision.");
    process.exit(1);
  }

  const rationale = await prompt("Rationale (required): ");

  if (!rationale) {
    console.error("Rationale is required.");
    process.exit(1);
  }

  const reviewer =
    process.env.USER ||
    process.env.USERNAME ||
    "unknown";

  const reviewRecord = {
    reviewedAt: new Date().toISOString(),
    reviewer,
    fromSnapshot,
    toSnapshot,
    decision,
    rationale,
    diffSummary: diff.summary,
    inspectionSummary: inspection.summary,
  };

  const reviewPath = path.join(
    REVIEW_ROOT,
    `${reviewRecord.reviewedAt}.json`
  );

  fs.writeFileSync(reviewPath, JSON.stringify(reviewRecord, null, 2), "utf8");

  console.log("\nReview recorded:", reviewPath);
})();

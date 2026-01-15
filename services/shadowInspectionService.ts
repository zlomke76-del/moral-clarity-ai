import { SnapshotDiff } from "./shadowSnapshotDiffService";

/* ------------------------------------------------------------
   Inspection types
------------------------------------------------------------ */

export type InspectionSeverity = "info" | "warn" | "critical";

export type InspectionFinding = {
  id: string;
  severity: InspectionSeverity;
  message: string;
  filePaths?: string[];
  inspector: string;
};

export type InspectionReport = {
  inspectedAt: string;
  fromSnapshot: string;
  toSnapshot: string;
  summary: {
    info: number;
    warn: number;
    critical: number;
  };
  findings: InspectionFinding[];
};

/* ------------------------------------------------------------
   Inspector interface (PLUGIN CONTRACT)
------------------------------------------------------------ */

export interface ShadowInspector {
  name: string;
  inspect(diff: SnapshotDiff): InspectionFinding[];
}

/* ------------------------------------------------------------
   Inspection engine
------------------------------------------------------------ */

export default class ShadowInspectionService {
  private inspectors: ShadowInspector[] = [];

  registerInspector(inspector: ShadowInspector): void {
    this.inspectors.push(inspector);
  }

  runInspection(
    diff: SnapshotDiff
  ): InspectionReport {
    const findings: InspectionFinding[] = [];

    for (const inspector of this.inspectors) {
      try {
        const result = inspector.inspect(diff);
        for (const finding of result) {
          findings.push({
            ...finding,
            inspector: inspector.name,
          });
        }
      } catch (err) {
        findings.push({
          id: "inspector-error",
          severity: "warn",
          message:
            `Inspector "${inspector.name}" failed: ` +
            (err instanceof Error ? err.message : String(err)),
          inspector: inspector.name,
        });
      }
    }

    const summary = {
      info: findings.filter(f => f.severity === "info").length,
      warn: findings.filter(f => f.severity === "warn").length,
      critical: findings.filter(f => f.severity === "critical").length,
    };

    return {
      inspectedAt: new Date().toISOString(),
      fromSnapshot: diff.fromSnapshot,
      toSnapshot: diff.toSnapshot,
      summary,
      findings,
    };
  }
}

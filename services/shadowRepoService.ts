import * as fs from "fs";
import * as path from "path";
import ShadowSnapshotService from "./shadowSnapshotService";
import ShadowSnapshotDiffService, {
  SnapshotDiff,
} from "./shadowSnapshotDiffService";
import ShadowInspectionService, {
  InspectionReport,
} from "./shadowInspectionService";

type ShadowRepoConfig = {
  mainRepoPath: string;
  shadowRepoPath: string;
  ignored?: string[];
};

export default class ShadowRepoService {
  private mainRepoPath: string;
  private shadowRepoPath: string;
  private auditLogFile: string;
  private ignored: Set<string>;

  private snapshotService: ShadowSnapshotService;
  private diffService: ShadowSnapshotDiffService;
  private inspectionService: ShadowInspectionService;

  constructor(config: ShadowRepoConfig) {
    if (!config.mainRepoPath || !config.shadowRepoPath) {
      throw new Error("ShadowRepoService: repo paths must be provided");
    }

    this.mainRepoPath = path.resolve(config.mainRepoPath);
    this.shadowRepoPath = path.resolve(config.shadowRepoPath);
    this.auditLogFile = path.join(this.shadowRepoPath, "shadow-audit.log");

    this.ignored = new Set(
      config.ignored ?? [
        ".git",
        "node_modules",
        "dist",
        "build",
        ".next",
        ".snapshots",
        ".reviews",
      ]
    );

    this.snapshotService = new ShadowSnapshotService(
      this.shadowRepoPath,
      Array.from(this.ignored)
    );

    this.diffService = new ShadowSnapshotDiffService(this.shadowRepoPath);
    this.inspectionService = new ShadowInspectionService();
  }

  /* ------------------------------------------------------------
     Audit
  ------------------------------------------------------------ */
  private logAudit(message: string): void {
    const line = `[${new Date().toISOString()}] ${message}\n`;
    try {
      fs.appendFileSync(this.auditLogFile, line, "utf8");
    } catch (err) {
      console.error("AUDIT LOG FAILURE:", err);
    }
  }

  /* ------------------------------------------------------------
     Public API
  ------------------------------------------------------------ */
  async initializeShadowRepo(): Promise<void> {
    if (!fs.existsSync(this.shadowRepoPath)) {
      fs.mkdirSync(this.shadowRepoPath, { recursive: true });
    }
    this.logAudit("Shadow repo initialized.");
  }

  /**
   * Optional external registration of inspectors
   */
  registerInspector(inspector: any): void {
    this.inspectionService.registerInspector(inspector);
  }

  async syncShadowRepo(): Promise<void> {
    if (!fs.existsSync(this.mainRepoPath)) {
      throw new Error("Main repo path does not exist");
    }

    /* ------------------------------------------------------------
       1. Mirror + prune
    ------------------------------------------------------------ */
    this.mirrorDirectory(this.mainRepoPath, this.shadowRepoPath);
    this.pruneDeleted(this.mainRepoPath, this.shadowRepoPath);
    this.logAudit("Shadow repo sync completed.");

    /* ------------------------------------------------------------
       2. Snapshot
    ------------------------------------------------------------ */
    let snapshotId: string;

    try {
      const manifest = this.snapshotService.createSnapshot();
      snapshotId = manifest.snapshotId;
      this.logAudit(
        `Snapshot created: ${snapshotId} (${manifest.fileCount} files)`
      );
    } catch (err) {
      this.logAudit(
        `SNAPSHOT ERROR: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      return;
    }

    /* ------------------------------------------------------------
       3. Diff (if previous snapshot exists)
    ------------------------------------------------------------ */
    const snapshotRoot = path.join(this.shadowRepoPath, ".snapshots");
    const snapshots = fs
      .readdirSync(snapshotRoot)
      .filter(f => fs.statSync(path.join(snapshotRoot, f)).isDirectory())
      .sort();

    if (snapshots.length < 2) {
      this.logAudit("No previous snapshot available for diff.");
      return;
    }

    const prevSnapshotId = snapshots[snapshots.length - 2];

    let diff: SnapshotDiff;
    try {
      diff = this.diffService.diffSnapshots(
        prevSnapshotId,
        snapshotId
      );
      this.persistDiff(snapshotId, diff);
      this.logAudit(
        `Diff generated: ${prevSnapshotId} → ${snapshotId}`
      );
    } catch (err) {
      this.logAudit(
        `DIFF ERROR: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      return;
    }

    /* ------------------------------------------------------------
       4. Inspection
    ------------------------------------------------------------ */
    try {
      const report = this.inspectionService.runInspection(diff);
      this.persistInspectionReport(snapshotId, report);
      this.logAudit(
        `Inspection completed: ${report.summary.critical} critical, ${report.summary.warn} warnings`
      );
    } catch (err) {
      this.logAudit(
        `INSPECTION ERROR: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /* ------------------------------------------------------------
     Persistence helpers
  ------------------------------------------------------------ */

  private persistDiff(snapshotId: string, diff: SnapshotDiff): void {
    const diffPath = path.join(
      this.shadowRepoPath,
      ".snapshots",
      snapshotId,
      "diff.json"
    );

    fs.writeFileSync(diffPath, JSON.stringify(diff, null, 2), "utf8");
  }

  private persistInspectionReport(
    snapshotId: string,
    report: InspectionReport
  ): void {
    const reportPath = path.join(
      this.shadowRepoPath,
      ".snapshots",
      snapshotId,
      "inspection-report.json"
    );

    fs.writeFileSync(
      reportPath,
      JSON.stringify(report, null, 2),
      "utf8"
    );
  }

  /* ------------------------------------------------------------
     Internal: Mirror + Prune
  ------------------------------------------------------------ */

  private mirrorDirectory(src: string, dest: string): void {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      if (this.ignored.has(entry.name)) continue;

      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.mirrorDirectory(srcPath, destPath);
      } else if (entry.isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  private pruneDeleted(src: string, dest: string): void {
    if (!fs.existsSync(dest)) return;

    const entries = fs.readdirSync(dest, { withFileTypes: true });

    for (const entry of entries) {
      if (this.ignored.has(entry.name)) continue;

      const destPath = path.join(dest, entry.name);
      const srcPath = path.join(src, entry.name);

      if (!fs.existsSync(srcPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
        this.logAudit(`Pruned deleted path: ${destPath}`);
      } else if (entry.isDirectory()) {
        this.pruneDeleted(srcPath, destPath);
      }
    }
  }
}

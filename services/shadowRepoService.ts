import * as fs from "fs";
import * as path from "path";
import ShadowSnapshotService from "./shadowSnapshotService";

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
      ]
    );

    this.snapshotService = new ShadowSnapshotService(
      this.shadowRepoPath,
      Array.from(this.ignored)
    );
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

  async syncShadowRepo(): Promise<void> {
    if (!fs.existsSync(this.mainRepoPath)) {
      throw new Error("Main repo path does not exist");
    }

    // 1. Mirror main → shadow
    this.mirrorDirectory(this.mainRepoPath, this.shadowRepoPath);

    // 2. Prune deletions
    this.pruneDeleted(this.mainRepoPath, this.shadowRepoPath);

    this.logAudit("Shadow repo sync completed.");

    // 3. Snapshot (evidence layer)
    try {
      const manifest = this.snapshotService.createSnapshot();
      this.logAudit(
        `Snapshot created: ${manifest.snapshotId} (${manifest.fileCount} files, ${manifest.totalBytes} bytes)`
      );
    } catch (err) {
      this.logAudit(
        `SNAPSHOT ERROR: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      // Snapshot failure does NOT invalidate sync
    }
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

import fs from "fs";
import path from "path";

type SnapshotManifest = {
  snapshotId: string;
  createdAt: string;
  fileCount: number;
  totalBytes: number;
  files: Record<
    string,
    {
      hash: string;
      size: number;
    }
  >;
};

export type SnapshotDiff = {
  fromSnapshot: string;
  toSnapshot: string;
  generatedAt: string;
  summary: {
    added: number;
    removed: number;
    modified: number;
  };
  added: string[];
  removed: string[];
  modified: string[];
};

export default class ShadowSnapshotDiffService {
  private snapshotRoot: string;

  constructor(shadowRepoPath: string) {
    this.snapshotRoot = path.join(
      path.resolve(shadowRepoPath),
      ".snapshots"
    );
  }

  /* ------------------------------------------------------------
     Public API
  ------------------------------------------------------------ */

  diffSnapshots(
    fromSnapshotId: string,
    toSnapshotId: string
  ): SnapshotDiff {
    const fromManifest = this.loadManifest(fromSnapshotId);
    const toManifest = this.loadManifest(toSnapshotId);

    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    const fromFiles = fromManifest.files;
    const toFiles = toManifest.files;

    // Removed or modified
    for (const filePath of Object.keys(fromFiles)) {
      if (!toFiles[filePath]) {
        removed.push(filePath);
      } else if (fromFiles[filePath].hash !== toFiles[filePath].hash) {
        modified.push(filePath);
      }
    }

    // Added
    for (const filePath of Object.keys(toFiles)) {
      if (!fromFiles[filePath]) {
        added.push(filePath);
      }
    }

    return {
      fromSnapshot: fromSnapshotId,
      toSnapshot: toSnapshotId,
      generatedAt: new Date().toISOString(),
      summary: {
        added: added.length,
        removed: removed.length,
        modified: modified.length,
      },
      added,
      removed,
      modified,
    };
  }

  /* ------------------------------------------------------------
     Internal
  ------------------------------------------------------------ */

  private loadManifest(snapshotId: string): SnapshotManifest {
    const manifestPath = path.join(
      this.snapshotRoot,
      snapshotId,
      "manifest.json"
    );

    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Snapshot manifest not found: ${snapshotId}`);
    }

    const raw = fs.readFileSync(manifestPath, "utf8");
    return JSON.parse(raw) as SnapshotManifest;
  }
}

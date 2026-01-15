import { ShadowInspector } from "../shadowInspectionService";
import { SnapshotDiff } from "../shadowSnapshotDiffService";

export const DestructiveChangeInspector: ShadowInspector = {
  name: "destructive-change-inspector",

  inspect(diff: SnapshotDiff) {
    const findings = [];

    for (const file of diff.removed) {
      findings.push({
        id: "file-removed",
        severity: "info",
        message: "File was removed",
        filePaths: [file],
      });
    }

    return findings;
  },
};

import * as fs from "fs";
import * as path from "path";

// *** CONFIG: Replace with your repo paths ***
const MAIN_REPO_PATH = "/absolute/path/to/main/repo";
const SHADOW_REPO_PATH = "/absolute/path/to/shadow/repo";
const AUDIT_LOG_FILE = path.join(SHADOW_REPO_PATH, "shadow_audit.log");
/**********************************************/

function logAudit(msg: string): void {
  const line = new Date().toISOString() + " | " + msg + "\n";
  try {
    fs.appendFileSync(AUDIT_LOG_FILE, line, "utf8");
  } catch (_) {
    // Silent fail: audit log is non-critical for repo sync.
  }
}

// Utility: Recursively copy directory tree (dir -> dest)
function copyDir(srcDir: string, destDir: string): void {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
    // Symlinks and special files ignored for safety
  }
}

// Mirror: Copy main repo to shadow repo (overwrite)
function mirrorToShadowRepo(): void {
  if (!fs.existsSync(MAIN_REPO_PATH)) return;
  if (!fs.existsSync(SHADOW_REPO_PATH)) fs.mkdirSync(SHADOW_REPO_PATH, { recursive: true });
  copyDir(MAIN_REPO_PATH, SHADOW_REPO_PATH);
  logAudit("Mirror: Repo sync completed.");
}

// File system watcher (main repo -> shadow on change)
function watchMainRepo(): void {
  if (!fs.existsSync(MAIN_REPO_PATH)) return;
  fs.watch(MAIN_REPO_PATH, { recursive: true }, (event, filename) => {
    logAudit("Detected change: " + filename + " (" + event + ")");
    try {
      mirrorToShadowRepo();
      // Stub: add inspection here
      logAudit("Inspection: Stub ");
    } catch (err) {
      logAudit("Error during mirror/inspection: " + (err instanceof Error ? err.message : String(err)));
    }
  });
}

// Manual script entry-point: to be called by an explicit script or test
export function startShadowRepoMonitor(): void {
  logAudit("Manual startup requested.");
  mirrorToShadowRepo();
  watchMainRepo();
}

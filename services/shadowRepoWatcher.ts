// services/shadowRepoWatcher.ts

import chokidar from "chokidar";
import path from "path";
import fs from "fs";
import ShadowRepoService from "./shadowRepoService";

/* ------------------------------------------------------------
   Environment configuration (AUTHORITATIVE)
------------------------------------------------------------ */

const MAIN_REPO_PATH = process.env.MAIN_REPO_PATH!;
const SHADOW_REPO_PATH = process.env.SHADOW_REPO_PATH!;

if (!MAIN_REPO_PATH || !SHADOW_REPO_PATH) {
  throw new Error(
    "shadowRepoWatcher: MAIN_REPO_PATH and SHADOW_REPO_PATH must be defined"
  );
}

const AUDIT_LOG = path.join(SHADOW_REPO_PATH, "shadow-audit.log");

/* ------------------------------------------------------------
   Shadow repo service
------------------------------------------------------------ */

const repoService = new ShadowRepoService({
  mainRepoPath: MAIN_REPO_PATH,
  shadowRepoPath: SHADOW_REPO_PATH,
});

/* ------------------------------------------------------------
   Audit logging
------------------------------------------------------------ */

function logAudit(message: string) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;

  try {
    fs.appendFileSync(AUDIT_LOG, line, "utf8");
  } catch (err) {
    // Audit failure must never be silent
    console.error("AUDIT LOG FAILURE:", err);
  }
}

/* ------------------------------------------------------------
   Sync throttling (storm-safe)
------------------------------------------------------------ */

let syncInProgress = false;
let pendingSync = false;

async function safeSync(event: string, changedPath: string) {
  if (syncInProgress) {
    pendingSync = true;
    return;
  }

  syncInProgress = true;

  try {
    await repoService.syncShadowRepo();
    logAudit(`Detected ${event} on ${changedPath}, shadow repo synced.`);
  } catch (err) {
    logAudit(
      `ERROR during sync: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  } finally {
    syncInProgress = false;

    if (pendingSync) {
      pendingSync = false;
      await safeSync("batch", "multiple changes");
    }
  }
}

/* ------------------------------------------------------------
   File watcher (OBSERVATION ONLY)
------------------------------------------------------------ */

const watcher = chokidar.watch(MAIN_REPO_PATH, {
  persistent: true,
  ignoreInitial: true,
  ignored: [
    "**/.git/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
  ],
});

watcher.on("all", (event, changedPath) => {
  safeSync(event, changedPath);
});

/* ------------------------------------------------------------
   Startup & shutdown
------------------------------------------------------------ */

(async () => {
  try {
    await repoService.initializeShadowRepo();
    await repoService.syncShadowRepo();
    logAudit("Initial sync complete. Watching for changes...");
  } catch (err) {
    logAudit(
      `ERROR during startup: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    process.exit(1);
  }
})();

process.on("SIGINT", async () => {
  logAudit("Shutdown signal received. Closing watcher.");
  await watcher.close();
  process.exit(0);
});

// services/shadowRepoWatcher.ts

import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';
import ShadowRepoService from './shadowRepoService';

const MAIN_REPO_PATH = '/absolute/path/to/main/repo';     // UPDATE with your actual path
const SHADOW_REPO_PATH = '/absolute/path/to/shadow/repo'; // UPDATE with your actual path
const AUDIT_LOG = path.join(SHADOW_REPO_PATH, 'shadow-audit.log');

const repoService = new ShadowRepoService({
  repoPath: MAIN_REPO_PATH,
  shadowPath: SHADOW_REPO_PATH,
});

function logAudit(message: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(AUDIT_LOG, `[${timestamp}] ${message}\n`);
}

// Watch for file changes
const watcher = chokidar.watch(MAIN_REPO_PATH, {
  persistent: true,
  ignoreInitial: true,
});

watcher.on('all', async (event, changedPath) => {
  try {
    await repoService.syncShadowRepo();
    logAudit(`Detected ${event} on ${changedPath}, shadow repo synced.`);
  } catch (err) {
    logAudit(`ERROR: ${err}`);
  }
});

(async () => {
  try {
    await repoService.initializeShadowRepo();
    await repoService.syncShadowRepo();
    logAudit('Initial sync complete. Watching for changes...');
  } catch (err) {
    logAudit(`ERROR during startup: ${err}`);
    process.exit(1);
  }
})();

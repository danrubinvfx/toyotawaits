/**
 * scripts/discovery/sweep-cron.ts
 *
 * Unattended Scheduled Sweep Cron Runner for ToyotaWaits.ca
 * Designed for execution via cron job, scheduled task, or GitHub Actions.
 *
 * Safeguards:
 * - Automatically targets all registered dealerships (--all).
 * - Enforces POLITE_DEALER_COOLDOWN_MS = 4000 between store requests.
 * - Enforces store-level error isolation so individual endpoint downtime does not halt remaining stores.
 * - Explicitly terminates with process.exit(0) on success and process.exit(1) on fatal runner error.
 *
 * Usage:
 *   npx tsx scripts/discovery/sweep-cron.ts
 *   npx tsx scripts/discovery/sweep-cron.ts --dry-run
 */

import { spawn } from 'child_process';
import * as path from 'path';

export const POLITE_DEALER_COOLDOWN_MS = 4000;

async function runCronSweep() {
  console.log(`[SWEEP-CRON] Launching unattended multi-dealer inventory sweep...`);
  console.log(`[SWEEP-CRON] Cooldown safeguard: ${POLITE_DEALER_COOLDOWN_MS}ms enforced between stores.`);

  const args = process.argv.slice(2);
  const runnerArgs = ['scripts/discovery/sweep-dealer.ts', '--all', ...args.filter((a) => a !== '--all')];

  // Spawn child tsx runner with stdout/stderr inheritance
  const child = spawn(process.execPath, ['--no-warnings', '-r', 'tsx', ...runnerArgs], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      CI: 'true',
    },
  });

  child.on('error', (err) => {
    console.error(`[SWEEP-CRON FATAL] Failed to spawn runner process:`, err);
    process.exit(1);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`[SWEEP-CRON] Unattended sweep completed successfully (exit code 0).`);
      process.exit(0);
    } else {
      console.error(`[SWEEP-CRON] Unattended sweep exited with code ${code}.`);
      process.exit(code || 1);
    }
  });
}

runCronSweep().catch((err) => {
  console.error(`[SWEEP-CRON UNHANDLED]`, err);
  process.exit(1);
});

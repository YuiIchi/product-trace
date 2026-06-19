import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const SESSION_FILE = '.pt-session';

/**
 * Save the current HEAD as the session start commit.
 */
export function saveSessionStart(cwd: string, headCommit: string): void {
  const { writeFileSync } = require('fs');
  writeFileSync(join(cwd, SESSION_FILE), headCommit);
}

/**
 * Get the session start commit.
 */
export function getSessionStart(cwd: string): string | null {
  const path = join(cwd, SESSION_FILE);
  if (!existsSync(path)) return null;
  try {
    return readFileSync(path, 'utf-8').trim();
  } catch {
    return null;
  }
}

/**
 * Clean up session file after session-stop.
 */
export function clearSession(cwd: string): void {
  const { unlinkSync } = require('fs');
  try { unlinkSync(join(cwd, SESSION_FILE)); } catch {}
}

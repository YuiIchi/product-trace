import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Find ROADMAP.md in the project directory.
 * Searches docs/ROADMAP.md first, then docs/features/*\/ROADMAP.md.
 */
export function findRoadmap(cwd: string): string | null {
  // Simple project structure
  const simple = join(cwd, 'docs', 'ROADMAP.md');
  if (existsSync(simple)) return simple;

  // Feature-based structure: docs/features/<feature>/ROADMAP.md
  const featuresDir = join(cwd, 'docs', 'features');
  if (existsSync(featuresDir)) {
    try {
      const entries = readdirSync(featuresDir);
      for (const entry of entries) {
        const path = join(featuresDir, entry, 'ROADMAP.md');
        if (existsSync(path)) return path;
      }
    } catch {}
  }

  return null;
}

/**
 * Find the sprints directory for a given feature dir path (where ROADMAP.md lives).
 */
export function findSprintsDir(featureDir: string): string | null {
  const sprintsDir = join(featureDir, 'sprints');
  if (existsSync(sprintsDir)) return sprintsDir;
  return null;
}

/**
 * Find spec.md for the given sprint from the feature dir.
 */
export function findSpecFile(featureDir: string, sprintName: string): string | null {
  const sprintsDir = findSprintsDir(featureDir);
  if (!sprintsDir) return null;

  // sprintName like "Sprint 1" → try "sprint-1", "1"
  const num = sprintName.replace(/^Sprint\s+/i, '');
  const candidates = [`sprint-${num}`, num];

  for (const cand of candidates) {
    const path = join(sprintsDir, cand, 'spec.md');
    if (existsSync(path)) return path;
  }

  return null;
}

/**
 * Find corrections file for any sprint.
 */
export function findCorrectionsFile(cwd: string): string | null {
  const featuresDir = join(cwd, 'docs', 'features');
  if (!existsSync(featuresDir)) return null;

  try {
    const features = readdirSync(featuresDir);
    for (const feature of features) {
      const sprintsDir = join(featuresDir, feature, 'sprints');
      if (!existsSync(sprintsDir)) continue;
      const sprints = readdirSync(sprintsDir);
      for (const sprint of sprints) {
        const path = join(sprintsDir, sprint, `corrections-${sprint}.md`);
        if (existsSync(path)) return path;
      }
    }
  } catch {}

  return null;
}

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { parseRoadmap, getStoryStatus } from '../lib/roadmap';

export function ptProgress(): void {
  const cwd = process.cwd();
  const roadmapPath = findRoadmapFile(cwd);

  if (!roadmapPath) {
    console.log('未找到 roadmap.md');
    return;
  }

  let roadmap;
  try {
    roadmap = parseRoadmap(readFileSync(roadmapPath, 'utf-8'));
  } catch (e: any) {
    console.log(`❌ ${e.message}`);
    return;
  }

  console.log('=== Product Trace 进度 ===');
  console.log();

  let totalStories = 0;
  let totalCompleted = 0;

  for (const sprint of roadmap.sprints) {
    const status = getStoryStatus(sprint);
    const prefix = sprint.isCurrent ? '▸ ' : '  ';
    const marker = sprint.completed ? ' ✅' : '';
    const pct = status.total > 0 ? Math.round(status.completed / status.total * 100) : 0;

    // Progress bar: ████████░░ 80%
    const barLen = 10;
    const filled = Math.round(pct / 100 * barLen);
    const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);

    console.log(`${prefix}${sprint.name}: ${sprint.goal}${marker}`);
    console.log(`  ${bar} ${pct}% (${status.completed}/${status.total})`);
    console.log(`  ✅${status.completed}  ~${status.inProgress}  ⬜${status.pending}  ❗${status.blocked}`);
    console.log();

    totalStories += status.total;
    totalCompleted += status.completed;
  }

  const overallPct = totalStories > 0 ? Math.round(totalCompleted / totalStories * 100) : 0;
  console.log(`总计: ${totalCompleted}/${totalStories} (${overallPct}%)`);

  if (roadmap.backlogs.length > 0) {
    console.log();
    console.log(`Backlog: ${roadmap.backlogs.length} 项`);
  }
}

function findRoadmapFile(cwd: string): string | null {
  const paths = [
    join(cwd, 'docs/roadmap.md'),
    join(cwd, 'docs/features/main/roadmap.md'),
  ];
  const found = paths.find(p => existsSync(p));
  if (found) return found;

  const featuresDir = join(cwd, 'docs/features');
  if (existsSync(featuresDir)) {
    try {
      for (const entry of readdirSync(featuresDir)) {
        const p = join(featuresDir, entry, 'roadmap.md');
        if (existsSync(p)) return p;
      }
    } catch {}
  }
  return null;
}

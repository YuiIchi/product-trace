import { readFileSync } from 'fs';
import { parseRoadmap, getStoryStatus } from '../lib/roadmap';
import { findRoadmap } from '../lib/project';

export function ptProgress(): void {
  const cwd = process.cwd();
  const roadmapPath = findRoadmap(cwd);

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

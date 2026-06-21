import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseRoadmap, getCurrentSprint, getStoryStatus } from '../lib/roadmap';

export function ptStatus(): void {
  const cwd = process.cwd();

  // Find roadmap.md
  const roadmapPaths = [
    join(cwd, 'docs/roadmap.md'),
    join(cwd, 'docs/features/main/roadmap.md'),
  ];

  let roadmapPath = roadmapPaths.find(p => existsSync(p));
  if (!roadmapPath) {
    // Try to find any feature dir
    const featuresDir = join(cwd, 'docs/features');
    if (existsSync(featuresDir)) {
      try {
        const entries = require('fs').readdirSync(featuresDir);
        for (const entry of entries) {
          const p = join(featuresDir, entry, 'roadmap.md');
          if (existsSync(p)) { roadmapPath = p; break; }
        }
      } catch {}
    }
  }

  if (!roadmapPath) {
    console.log('未找到 roadmap.md');
    console.log('运行 pt init 初始化项目');
    return;
  }

  let roadmap;
  try {
    roadmap = parseRoadmap(readFileSync(roadmapPath, 'utf-8'));
  } catch (e: any) {
    console.log(`❌ ${e.message}`);
    return;
  }
  const current = getCurrentSprint(roadmap);

  console.log('=== Product Trace Status ===');
  console.log();

  // Show all sprints
  for (const sprint of roadmap.sprints) {
    const status = getStoryStatus(sprint);
    const marker = sprint.isCurrent ? ' ← current' : '';
    const check = sprint.completed ? ' ✅' : '';
    console.log(`${sprint.name}: ${sprint.goal}${check}${marker}`);
    console.log(`  进度: ${status.completed}/${status.total} ✅ | ${status.inProgress} ~ | ${status.pending} ⬜ | ${status.blocked} ❗`);

    for (const story of sprint.stories) {
      const note = story.note ? ` — ${story.note}` : '';
      console.log(`  ${story.checkbox} ${story.id}: ${story.title}${note}`);
    }
    console.log();
  }

  if (roadmap.backlogs.length > 0) {
    console.log('Backlog:');
    for (const story of roadmap.backlogs) {
      console.log(`  ${story.id}: ${story.title}`);
    }
    console.log();
  }
}

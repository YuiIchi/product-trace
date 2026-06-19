import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseRoadmap, getCurrentSprint, getStoryStatus } from '../lib/roadmap';
import { parseSpec } from '../lib/spec';
import { getHeadCommit, countCommitsSince } from '../lib/git';

function findRoadmap(cwd: string): string | null {
  // 1. 直接 docs/ROADMAP.md（简单项目）
  const simple = join(cwd, 'docs/ROADMAP.md');
  if (existsSync(simple)) return simple;

  // 2. docs/features/*/ROADMAP.md（多 feature 项目）
  const featuresDir = join(cwd, 'docs/features');
  if (existsSync(featuresDir)) {
    // 尝试找到有 ← current 标记的 ROADMAP
    // 简化：返回第一个找到的
  }

  return null;
}

function findSpecForSprint(cwd: string, sprintName: string): string | null {
  // docs/features/*/sprints/<sprint-name>/spec.md
  const sprintNum = sprintName.replace('Sprint ', '').toLowerCase();
  const patterns = [
    join(cwd, 'docs/features', '*', 'sprints', `sprint-${sprintNum}`, 'spec.md'),
    join(cwd, 'docs/features', '*', 'sprints', sprintNum, 'spec.md'),
  ];

  for (const pattern of patterns) {
    // 简化：glob 搜索
    const tryDir = (base: string) => {
      const dirs = ['sprint-1', 'sprint-2', 'sprint-3', '1', '2', '3'];
      for (const d of dirs) {
        const path = join(base, d, 'spec.md');
        if (existsSync(path)) return path;
      }
      return null;
    };

    const featuresDir = join(cwd, 'docs/features');
    if (existsSync(featuresDir)) {
      // 遍历 features 目录
      try {
        const entries = require('fs').readdirSync(featuresDir);
        for (const entry of entries) {
          const path = join(featuresDir, entry, 'sprints');
          if (existsSync(path)) {
            const result = tryDir(path);
            if (result) return result;
          }
        }
      } catch {}
    }
  }

  return null;
}

export async function sessionStart(): Promise<void> {
  const cwd = process.cwd();

  // Step 1: Find ROADMAP.md
  const roadmapPath = findRoadmap(cwd);

  if (!roadmapPath) {
    console.log('📋 Product Trace');
    console.log();
    console.log('未找到 ROADMAP.md');
    console.log('运行 pt init 初始化项目，或 cd 到项目根目录');
    return;
  }

  const roadmap = parseRoadmap(readFileSync(roadmapPath, 'utf-8'));
  const current = getCurrentSprint(roadmap);

  // Feature name from path
  const featureMatch = roadmapPath.match(/features\/([^/]+)/);
  const featureName = featureMatch ? featureMatch[1] : pathToFeature(cwd);

  console.log(`📋 Product Trace: feature/${featureName}`);
  console.log();

  if (!current) {
    console.log('当前: 无活跃 Sprint');
    console.log('运行 pt new-sprint 创建新 Sprint，或在 ROADMAP.md 标记 ← current');
    return;
  }

  const status = getStoryStatus(current);
  console.log(`当前: ${current.name} — ${current.goal}`);

  // In-progress stories
  const inProgressStories = current.stories.filter(s => s.checkbox === '[~]');
  if (inProgressStories.length > 0) {
    console.log(`进行中: ${inProgressStories.map(s => `[~] ${s.id}: ${s.title}`).join(', ')}`);
  }

  // Pending stories
  const pendingStories = current.stories.filter(s => s.checkbox === '[ ]');
  if (pendingStories.length > 0) {
    console.log(`待开始: ${pendingStories.map(s => `${s.id}: ${s.title}`).join(', ')}`);
  }

  // Blocked stories
  const blockedStories = current.stories.filter(s => s.checkbox === '[!]');
  for (const s of blockedStories) {
    console.log(`阻塞:   [!] ${s.id}: ${s.title}${s.note ? ` — ${s.note}` : ''}`);
  }

  // Progress
  const pct = status.total > 0 ? Math.round(status.completed / status.total * 100) : 0;
  console.log(`进度: ${status.completed}/${status.total} ✅ | ${status.inProgress} ~ | ${status.pending} ⬜ | ${status.blocked} ❗ (${pct}%)`);

  console.log();

  // Step 2: Read spec.md and check drift
  const specPath = findSpecForSprint(cwd, current.name);
  if (specPath && existsSync(specPath)) {
    const spec = parseSpec(readFileSync(specPath, 'utf-8'));
    const headCommit = await getHeadCommit();
    const downstream = spec.lastVerifiedAgainst.downstream;

    if (downstream && downstream !== 'none') {
      const commitsSince = await countCommitsSince(downstream);
      if (commitsSince > 0) {
        console.log(`⚠️ spec.md: ${commitsSince} commits since last verification`);
      }
    }

    if (spec.openCorrections > 0) {
      console.log(`⚠️ ${spec.openCorrections} 条未处理 CORR`);
    }

    if (spec.status === 'drifted') {
      console.log('⚠️ spec.md status: drifted — 需要对账');
    }
  }

  // Step 3: Check SIGNAL placeholders in corrections file
  const correctionsPath = findCorrectionsFile(cwd);
  if (correctionsPath && existsSync(correctionsPath)) {
    const content = readFileSync(correctionsPath, 'utf-8');
    const signals = (content.match(/SIGNAL/g) || []);
    if (signals.length > 0) {
      console.log(`⚠️ ${signals.length} 条 SIGNAL 占位待升级为 CORR`);
    }
  }

  if (blockedStories.length > 0 || (specPath && existsSync(specPath))) {
    console.log();
    console.log('建议: 先对账 spec.md 并处理阻塞项，再继续开发');
  }
}

function pathToFeature(cwd: string): string {
  // Try to extract from directory name
  const parts = cwd.split('/');
  return parts[parts.length - 1] || 'main';
}

function findCorrectionsFile(cwd: string): string | null {
  const featuresDir = join(cwd, 'docs/features');
  if (!existsSync(featuresDir)) return null;
  try {
    const entries = require('fs').readdirSync(featuresDir);
    for (const entry of entries) {
      const sprintsDir = join(featuresDir, entry, 'sprints');
      if (existsSync(sprintsDir)) {
        const sprintDirs = require('fs').readdirSync(sprintsDir);
        for (const sd of sprintDirs) {
          const path = join(sprintsDir, sd, `corrections-${sd}.md`);
          if (existsSync(path)) return path;
        }
      }
    }
  } catch {}
  return null;
}

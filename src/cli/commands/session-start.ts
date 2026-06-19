import { readFileSync, existsSync } from 'fs';
import { parseRoadmap, getCurrentSprint, getStoryStatus } from '../lib/roadmap';
import { parseSpec } from '../lib/spec';
import { getHeadCommit, countCommitsSince } from '../lib/git';
import { findRoadmap, findSpecFile, findCorrectionsFile } from '../lib/project';
import { saveSessionStart } from '../lib/session';

export async function sessionStart(): Promise<void> {
  const cwd = process.cwd();

  // Step 0: Save session start commit for session-stop comparison
  const headCommit = await getHeadCommit();
  if (headCommit) {
    saveSessionStart(cwd, headCommit);
  }

  // Step 1: Find and read ROADMAP.md
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
  const featureName = featureMatch ? featureMatch[1] : extractName(cwd);

  console.log(`📋 Product Trace: feature/${featureName}`);
  console.log();

  if (!current) {
    console.log('当前: 无活跃 Sprint');
    console.log('在 ROADMAP.md 中标记 ← current 来激活 Sprint');
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
  const featureDir = roadmapPath.replace('/ROADMAP.md', '');
  const specPath = findSpecFile(featureDir, current.name);
  if (specPath && existsSync(specPath)) {
    const spec = parseSpec(readFileSync(specPath, 'utf-8'));
    const downstream = spec.lastVerifiedAgainst.downstream;

    if (downstream && downstream !== 'none') {
      const commitsSince = await countCommitsSince(downstream);
      if (commitsSince > 0) {
        console.log(`⚠️ spec.md: ${commitsSince} commits since last verification`);
      }
    }

    if (spec.openCorrections > 0) {
      console.log(`⚠️ ${spec.openCorrections} 条未处理 CORR (open-corrections: ${spec.openCorrections})`);
    }

    if (spec.status === 'drifted') {
      console.log('⚠️ spec.md status: drifted — 需要对账');
    }
  }

  // Step 3: Check SIGNAL placeholders
  const correctionsPath = findCorrectionsFile(cwd);
  if (correctionsPath && existsSync(correctionsPath)) {
    const content = readFileSync(correctionsPath, 'utf-8');
    const signals = (content.match(/^- .*SIGNAL/gm) || []);
    if (signals.length > 0) {
      console.log(`⚠️ ${signals.length} 条 SIGNAL 占位待升级为 CORR`);
    }
  }

  console.log();
  console.log('建议: 先对账再继续开发');
}

function extractName(cwd: string): string {
  const parts = cwd.split('/');
  return parts[parts.length - 1] || 'main';
}

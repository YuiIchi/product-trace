import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { getTemplateContent } from '../lib/project';

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

function extractFeature(roadmapPath: string): string {
  const match = roadmapPath.match(/features\/([^/]+)/);
  return match ? match[1] : 'main';
}

export function ptNewSprint(): void {
  const cwd = process.cwd();

  const roadmapPath = findRoadmapFile(cwd);
  if (!roadmapPath) {
    console.log('未找到 roadmap.md。运行 pt init 初始化项目。');
    return;
  }

  const featureDir = join(roadmapPath, '..');
  const sprintsDir = join(featureDir, 'sprints');
  if (!existsSync(sprintsDir)) {
    mkdirSync(sprintsDir, { recursive: true });
  }

  const existingSprints = readdirSync(sprintsDir).filter(d => d.startsWith('sprint-'));
  const nextNum = existingSprints.length + 1;
  const sprintDir = join(sprintsDir, `sprint-${nextNum}`);

  if (existsSync(sprintDir)) {
    console.log(`sprint-${nextNum}/ 已存在`);
    return;
  }

  mkdirSync(sprintDir, { recursive: true });
  mkdirSync(join(sprintDir, 'acceptance'), { recursive: true });
  console.log(`  ✅ sprint-${nextNum}/`);
  console.log(`  ✅ sprint-${nextNum}/acceptance/`);

  const today = new Date().toISOString().split('T')[0];
  const feature = extractFeature(roadmapPath);

  // Read spec template and fill variables
  const specTemplate = getTemplateContent('spec');
  const specContent = (specTemplate || '')
    .replace(/<feature-slug>/g, feature)
    .replace(/sprint: N/g, `sprint: ${nextNum}`)
    .replace(/Sprint N/g, `Sprint ${nextNum}`)
    .replace(/YYYY-MM-DD/g, today)
    .replace(/ROADMAP\.md@vX/g, 'roadmap.md@v1.0');
  writeFileSync(join(sprintDir, 'spec.md'), specContent);
  console.log(`  ✅ sprint-${nextNum}/spec.md`);

  // Read corrections template and fill
  const corrTemplate = getTemplateContent('corrections');
  const corrContent = (corrTemplate || `# Sprint ${nextNum} 纠偏日志\n\n> 创建: ${today} | spec 初始版本: v1.0\n\n## CORR 条目\n\n## SIGNAL 占位\n`)
    .replace(/Sprint N/g, `Sprint ${nextNum}`)
    .replace(/YYY-MM-DD|YYYY-MM-DD/g, today);
  writeFileSync(join(sprintDir, `corrections-sprint-${nextNum}.md`), corrContent);
  console.log(`  ✅ sprint-${nextNum}/corrections-sprint-${nextNum}.md`);

  console.log();
  console.log('下一步:');
  console.log('  1. 在 roadmap.md 更新 Sprint 划分');
  console.log('  2. 编辑 spec.md');
  console.log('  3. 运行 /product-trace-design 开始 Sprint Design');
}

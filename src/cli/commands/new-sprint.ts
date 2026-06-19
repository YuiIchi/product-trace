import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export function ptNewSprint(): void {
  const cwd = process.cwd();

  // Find ROADMAP to get current sprint
  const roadmapPath = findRoadmapFile(cwd);
  if (!roadmapPath) {
    console.log('未找到 ROADMAP.md。运行 pt init 初始化项目。');
    return;
  }

  // Find existing sprint dirs to determine next sprint number
  const featureDir = join(roadmapPath, '..');
  const sprintsDir = findSprintsDir(featureDir);
  if (!sprintsDir) {
    console.log('未找到 sprints/ 目录');
    return;
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

  // Create spec.md from template
  const today = new Date().toISOString().split('T')[0];
  const specContent = `---
doc: spec
feature: ${extractFeature(roadmapPath)}
sprint: ${nextNum}
version: 1.0
status: draft
last-verified-against:
  upstream: ROADMAP.md@v1.0
  downstream: none
open-corrections: 0
last-correction: none
---

# Sprint ${nextNum}: <Sprint Goal>

> ROADMAP: Sprint ${nextNum}
> 上游: product-vision.md, architecture.md

## 1. 用户旅程（本 Sprint 交付的体验）

### 场景: <场景名>
**前置条件**: ...
**步骤**:
1. 用户做 X → 系统显示 Y
   - Loading: <行为>
   - Empty: <行为>
   - Error: <行为>
   - Edge: <边界情况>

## 2. 验收标准
- [ ] AC-1: <可测试的描述>
  验证方式: <命令或手动步骤>

## 3. 数据模型（本次新增/变更）
| 实体 | 字段 | 类型 | 必填 | 说明 |
|:--|:--|:--|:--|:--|

## 4. 实施拆解
### Story-001: <标题>
#### Task 1: <标题>
- 目标: <一句话>
- 涉及文件: \`path/\`
- 完成标准: <可验证>

## 5. 技术方案（非架构级则省略）

## 6. 纠偏摘要
| CORR | L | 触发 | 状态 |
|:--|:--|:--|:--|

## 7. 变更记录
| 版本 | 日期 | 变更 | 触发 |
|:--|:--|:--|:--|
| 1.0 | ${today} | 初始创建 | Sprint Design |
`;

  writeFileSync(join(sprintDir, 'spec.md'), specContent);
  console.log(`  ✅ sprint-${nextNum}/spec.md`);

  // Create empty corrections file
  const correctionsContent = `# Sprint ${nextNum} 纠偏日志

> 创建: ${today} | spec 初始版本: v1.0

## CORR 条目

## SIGNAL 占位
`;
  writeFileSync(join(sprintDir, `corrections-sprint-${nextNum}.md`), correctionsContent);
  console.log(`  ✅ sprint-${nextNum}/corrections-sprint-${nextNum}.md`);

  console.log();
  console.log('下一步:');
  console.log('  1. 在 ROADMAP.md 更新 Sprint 划分');
  console.log('  2. 编辑 spec.md');
  console.log('  3. 运行 /product-trace-design 开始 Sprint Design');
}

function findRoadmapFile(cwd: string): string | null {
  const paths = [
    join(cwd, 'docs/ROADMAP.md'),
    join(cwd, 'docs/features/main/ROADMAP.md'),
  ];
  const found = paths.find(p => existsSync(p));
  if (found) return found;

  const featuresDir = join(cwd, 'docs/features');
  if (existsSync(featuresDir)) {
    try {
      for (const entry of readdirSync(featuresDir)) {
        const p = join(featuresDir, entry, 'ROADMAP.md');
        if (existsSync(p)) return p;
      }
    } catch {}
  }
  return null;
}

function findSprintsDir(featureDir: string): string | null {
  const sprintsDir = join(featureDir, 'sprints');
  if (existsSync(sprintsDir)) return sprintsDir;

  // Create it if the feature dir exists
  mkdirSync(sprintsDir, { recursive: true });
  return sprintsDir;
}

function extractFeature(roadmapPath: string): string {
  const match = roadmapPath.match(/features\/([^/]+)/);
  return match ? match[1] : 'main';
}

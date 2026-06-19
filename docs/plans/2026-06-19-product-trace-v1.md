# Product Trace v1.0 实施计划

> **For Claude:** 每个 Task 完成后提交，遵循 TDD。

**目标**：从零搭建 Product Trace — TypeScript CLI + Claude Code Plugin + 安装脚本。

**架构**：
```
src/cli/          → pt CLI（agent 无关）
adapters/claude/  → CC Plugin（skills/hooks/templates）
install.sh        → 交互式安装（全局 ~/.claude/ / 本地 .claude/）
uninstall.sh      → 卸载
```

**技术栈**：TypeScript + Node.js，CLI 用 commander，Markdown 解析用 gray-matter，Git 操作用 simple-git。

---

## Phase 1: 项目骨架

### Task 1: 初始化项目

**文件**：
- Create: `package.json`
- Create: `tsconfig.json`

**Step 1: 创建 package.json**

```bash
npm init -y
```

**Step 2: 安装依赖**

```bash
npm install commander gray-matter simple-git
npm install -D typescript @types/node vitest
```

**Step 3: 配置 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true
  },
  "include": ["src/**/*.ts"]
}
```

**Step 4: 配置 package.json 入口和 bin**

在 `package.json` 中确认/添加：
```json
{
  "bin": {
    "pt": "./dist/cli/index.js"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

**Step 5: 验证**

```bash
npm run build
```
预期：dist/ 目录生成

**Step 6: 提交**

```bash
git add package.json package-lock.json tsconfig.json
git commit -m "chore: init TypeScript project"
```

---

### Task 2: CLI 入口和命令骨架

**文件**：
- Create: `src/cli/index.ts`

**Step 1: 写 CLI 入口**

```typescript
#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('pt')
  .description('Product Trace — 产品研发追踪工作流')
  .version('1.0.0');

// 占位 — 后续 Task 逐个注册命令
program
  .command('session-start')
  .description('读 ROADMAP + spec → 检测漂移 → 输出上下文')
  .action(() => {
    console.log('TODO: session-start');
  });

program
  .command('session-stop')
  .description('git diff → 强制对账三问')
  .action(() => {
    console.log('TODO: session-stop');
  });

program
  .command('init')
  .description('初始化 docs/ 目录结构 + 创建模板')
  .action(() => {
    console.log('TODO: init');
  });

program
  .command('status')
  .description('显示当前 Sprint、Story 进度、未关 CORR')
  .action(() => {
    console.log('TODO: status');
  });

program
  .command('new-sprint')
  .description('创建 sprint-N/ 目录 + spec.md')
  .action(() => {
    console.log('TODO: new-sprint');
  });

program
  .command('progress')
  .description('从 ROADMAP checkbox 统计完成度')
  .action(() => {
    console.log('TODO: progress');
  });

program
  .command('template <name>')
  .description('输出指定模板内容')
  .action((name: string) => {
    console.log(`TODO: template ${name}`);
  });

program.parse();
```

**Step 2: 构建并测试**

```bash
npm run build
node dist/cli/index.js --help
```
预期：显示 7 个命令列表

**Step 3: 验证全局安装（可选）**

```bash
npm link
pt --help
```
预期：同上

**Step 4: 提交**

```bash
git add src/cli/index.ts
git commit -m "feat: CLI 入口 + 7 命令骨架"
```

---

## Phase 2: CLI 核心库

### Task 3: ROADMAP 解析库

**文件**：
- Create: `src/cli/lib/roadmap.ts`
- Create: `src/cli/lib/__tests__/roadmap.test.ts`

**Step 1: 写测试**

```typescript
import { describe, it, expect } from 'vitest';
import { parseRoadmap, getCurrentSprint, getStoryStatus } from '../roadmap';

const sampleRoadmap = `---
doc: ROADMAP
current-sprint: Sprint 2
---

# ROADMAP — Test

> 当前 Sprint: Sprint 2 ← current

## 工作流状态
- Discover: ✅ product-vision.md v1.0
- Sprint 2: ← current

## Sprint 1: 基础架构 ✅
- [x] Story-001: 初始化项目
- [x] Story-002: 配置 CI

## Sprint 2: 用户认证 ← current
- [~] Story-003: 登录
- [ ] Story-004: 注册
- [!] Story-005: 第三方登录 — API 阻塞
`;

describe('parseRoadmap', () => {
  it('extracts current sprint', () => {
    const result = parseRoadmap(sampleRoadmap);
    expect(result.currentSprint).toBe('Sprint 2');
  });

  it('extracts sprint stories with status', () => {
    const result = parseRoadmap(sampleRoadmap);
    const sprint2 = result.sprints.find(s => s.name === 'Sprint 2');
    expect(sprint2).toBeDefined();
    expect(sprint2!.stories).toHaveLength(3);
    expect(sprint2!.stories[0].checkbox).toBe('[~]');
    expect(sprint2!.stories[0].title).toBe('Story-003: 登录');
  });

  it('detects blockers', () => {
    const result = parseRoadmap(sampleRoadmap);
    const blockers = result.sprints
      .flatMap(s => s.stories)
      .filter(s => s.checkbox === '[!]');
    expect(blockers).toHaveLength(1);
    expect(blockers[0].title).toContain('第三方登录');
  });
});

describe('getCurrentSprint', () => {
  it('finds sprint marked ← current', () => {
    const result = parseRoadmap(sampleRoadmap);
    const current = getCurrentSprint(result);
    expect(current!.name).toBe('Sprint 2');
  });
});

describe('getStoryStatus', () => {
  it('counts checkboxes by type', () => {
    const result = parseRoadmap(sampleRoadmap);
    const sprint2 = result.sprints.find(s => s.name === 'Sprint 2')!;
    const status = getStoryStatus(sprint2);
    expect(status.inProgress).toBe(1);   // [~]
    expect(status.pending).toBe(1);       // [ ]
    expect(status.blocked).toBe(1);       // [!]
  });
});
```

**Step 2: 跑测试确认失败**

```bash
npx vitest run src/cli/lib/__tests__/roadmap.test.ts
```
预期：全部 FAIL（模块不存在）

**Step 3: 实现 parseRoadmap**

```typescript
import matter from 'gray-matter';

export interface Story {
  checkbox: '[ ]' | '[~]' | '[x]' | '[!]';
  id: string;
  title: string;
  note?: string; // 阻塞原因等
}

export interface Sprint {
  name: string;
  goal: string;
  completed: boolean;
  isCurrent: boolean;
  stories: Story[];
}

export interface Roadmap {
  currentSprint: string | null;
  sprints: Sprint[];
  backlogs: Story[];
}

export function parseRoadmap(content: string): Roadmap {
  const { data, content: body } = matter(content);
  const lines = body.split('\n');
  
  const sprints: Sprint[] = [];
  const backlogs: Story[] = [];
  let currentSection: 'sprint' | 'backlog' | null = null;
  let currentSprint: Sprint | null = null;

  for (const line of lines) {
    // 检测 Sprint 标题: ## Sprint N: <goal>
    const sprintMatch = line.match(/^## Sprint (\d+): (.+)$/);
    if (sprintMatch) {
      if (currentSprint) sprints.push(currentSprint);
      const isCompleted = line.includes('✅');
      const isCurrent = line.includes('← current');
      currentSprint = {
        name: `Sprint ${sprintMatch[1]}`,
        goal: sprintMatch[2].replace(' ✅', '').replace(' ← current', '').trim(),
        completed: isCompleted,
        isCurrent,
        stories: [],
      };
      currentSection = 'sprint';
      continue;
    }

    // 检测 Backlog
    if (line.match(/^## Backlog/)) {
      if (currentSprint) sprints.push(currentSprint);
      currentSprint = null;
      currentSection = 'backlog';
      continue;
    }

    // 下一个 ## 节
    if (line.match(/^## /) && !line.match(/^## Sprint/)) {
      currentSection = null;
    }

    // 解析 checkbox 行: - [x] Story-001: <title>
    const storyMatch = line.match(/^- \[([ x~!])\] (\S+):?\s*(.+)$/);
    if (storyMatch) {
      const checkbox = `[${storyMatch[1]}]` as Story['checkbox'];
      const story: Story = {
        checkbox,
        id: storyMatch[2],
        title: storyMatch[3].trim(),
      };
      
      // 提取阻塞原因
      const noteMatch = story.title.match(/— (.+)$/);
      if (noteMatch && checkbox === '[!]') {
        story.note = noteMatch[1];
        story.title = story.title.replace(/ — .+$/, '');
      }

      if (currentSection === 'sprint' && currentSprint) {
        currentSprint.stories.push(story);
      } else if (currentSection === 'backlog') {
        backlogs.push(story);
      }
    }
  }

  if (currentSprint) sprints.push(currentSprint);

  return {
    currentSprint: data['current-sprint'] || null,
    sprints,
    backlogs,
  };
}

export function getCurrentSprint(roadmap: Roadmap): Sprint | undefined {
  return roadmap.sprints.find(s => s.isCurrent);
}

export interface StoryStatus {
  inProgress: number;
  pending: number;
  completed: number;
  blocked: number;
  total: number;
}

export function getStoryStatus(sprint: Sprint): StoryStatus {
  const status: StoryStatus = { inProgress: 0, pending: 0, completed: 0, blocked: 0, total: 0 };
  for (const s of sprint.stories) {
    status.total++;
    switch (s.checkbox) {
      case '[~]': status.inProgress++; break;
      case '[ ]': status.pending++; break;
      case '[x]': status.completed++; break;
      case '[!]': status.blocked++; break;
    }
  }
  return status;
}
```

**Step 4: 跑测试确认通过**

```bash
npx vitest run src/cli/lib/__tests__/roadmap.test.ts
```
预期：全部 PASS

**Step 5: 提交**

```bash
git add src/cli/lib/roadmap.ts src/cli/lib/__tests__/roadmap.test.ts
git commit -m "feat: ROADMAP 解析库"
```

---

### Task 4: spec.md front-matter 解析库

**文件**：
- Create: `src/cli/lib/spec.ts`
- Create: `src/cli/lib/__tests__/spec.test.ts`

**Step 1: 写测试**

```typescript
import { describe, it, expect } from 'vitest';
import { parseSpec, checkDrift } from '../spec';

const sampleSpec = `---
doc: spec
sprint: 2
version: 1.3
status: stable
last-verified-against:
  upstream: ROADMAP.md@v2.1
  downstream: abc123def
open-corrections: 1
last-correction: CORR-S2-004
---

# Sprint 2: 用户认证
`;

describe('parseSpec', () => {
  it('extracts version and status', () => {
    const result = parseSpec(sampleSpec);
    expect(result.version).toBe('1.3');
    expect(result.status).toBe('stable');
  });

  it('extracts last-verified-against', () => {
    const result = parseSpec(sampleSpec);
    expect(result.lastVerifiedAgainst.downstream).toBe('abc123def');
    expect(result.lastVerifiedAgainst.upstream).toBe('ROADMAP.md@v2.1');
  });

  it('extracts open-corrections', () => {
    const result = parseSpec(sampleSpec);
    expect(result.openCorrections).toBe(1);
  });
});

describe('checkDrift', () => {
  it('returns drift count when downstream does not match HEAD', () => {
    const result = checkDrift('abc123', 'def456', 3);
    expect(result.drifted).toBe(true);
    expect(result.commitsSince).toBe(3);
  });

  it('returns no drift when downstream matches HEAD', () => {
    const result = checkDrift('abc123', 'abc123', 0);
    expect(result.drifted).toBe(false);
  });
});
```

**Step 2: 跑测试确认失败**

```bash
npx vitest run src/cli/lib/__tests__/spec.test.ts
```
预期：FAIL

**Step 3: 实现**

```typescript
import matter from 'gray-matter';

export interface SpecData {
  doc: string;
  sprint: number;
  version: string;
  status: 'draft' | 'stable' | 'drifted' | 'archived';
  lastVerifiedAgainst: {
    upstream: string;
    downstream: string;
  };
  openCorrections: number;
  lastCorrection: string | null;
}

export function parseSpec(content: string): SpecData {
  const { data } = matter(content);
  return {
    doc: data.doc || 'spec',
    sprint: data.sprint || 0,
    version: data.version || '1.0',
    status: data.status || 'draft',
    lastVerifiedAgainst: {
      upstream: data['last-verified-against']?.upstream || '',
      downstream: data['last-verified-against']?.downstream || '',
    },
    openCorrections: data['open-corrections'] || 0,
    lastCorrection: data['last-correction'] || null,
  };
}

export interface DriftResult {
  drifted: boolean;
  commitsSince: number;
}

export function checkDrift(
  specCommit: string,
  headCommit: string,
  commitsSince: number
): DriftResult {
  return {
    drifted: specCommit !== headCommit,
    commitsSince,
  };
}
```

**Step 4: 验证**

```bash
npx vitest run src/cli/lib/__tests__/spec.test.ts
```
预期：PASS

**Step 5: 提交**

```bash
git add src/cli/lib/spec.ts src/cli/lib/__tests__/spec.test.ts
git commit -m "feat: spec front-matter 解析库"
```

---

### Task 5: Git 操作库

**文件**：
- Create: `src/cli/lib/git.ts`
- Create: `src/cli/lib/__tests__/git.test.ts`

**Step 1: 写测试**

```typescript
import { describe, it, expect } from 'vitest';
import simpleGit from 'simple-git';

// 使用真实仓库路径测试
const git = simpleGit(process.cwd());

describe('git lib', () => {
  it('gets HEAD commit hash', async () => {
    const log = await git.log({ maxCount: 1 });
    expect(log.latest).toBeDefined();
    expect(log.latest!.hash).toMatch(/^[a-f0-9]{7,40}$/);
  });

  it('gets diff stat', async () => {
    const diff = await git.diffSummary();
    expect(diff).toBeDefined();
    expect(Array.isArray(diff.files)).toBe(true);
  });

  it('counts commits between two refs', async () => {
    // 当前 HEAD 到 HEAD 应该是 0
    const headHash = (await git.log({ maxCount: 1 })).latest!.hash;
    const log = await git.log({ from: headHash, to: 'HEAD' });
    expect(log.total).toBeGreaterThanOrEqual(0);
  });
});
```

**Step 2: 跑测试确认失败**

```bash
npx vitest run src/cli/lib/__tests__/git.test.ts
```
预期：FAIL（文件不存在）

**Step 3: 实现**

```typescript
import simpleGit from 'simple-git';

const git = simpleGit(process.cwd());

export async function getHeadCommit(): Promise<string> {
  const log = await git.log({ maxCount: 1 });
  return log.latest?.hash || '';
}

export async function getDiffStat(): Promise<{ files: string[]; summary: string }> {
  const diff = await git.diffSummary();
  const files = diff.files.map(f => f.file);
  return {
    files,
    summary: `${diff.insertions} insertions(+), ${diff.deletions} deletions(-) across ${diff.files.length} files`,
  };
}

export async function countCommitsSince(sinceCommit: string): Promise<number> {
  try {
    const log = await git.log({ from: sinceCommit, to: 'HEAD' });
    return log.total;
  } catch {
    return -1; // commit not found
  }
}
```

**Step 4: 验证**

```bash
npx vitest run src/cli/lib/__tests__/git.test.ts
```
预期：PASS

**Step 5: 提交**

```bash
git add src/cli/lib/git.ts src/cli/lib/__tests__/git.test.ts
git commit -m "feat: git 操作库"
```

---

## Phase 3: CLI 命令实现

### Task 6: pt session-start

**文件**：
- Modify: `src/cli/index.ts`（注册命令）
- Create: `src/cli/commands/session-start.ts`

**Step 1: 实现 session-start**

```typescript
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseRoadmap, getCurrentSprint, getStoryStatus, Story } from '../lib/roadmap';
import { parseSpec } from '../lib/spec';
import { getHeadCommit, countCommitsSince } from '../lib/git';

export async function sessionStart(): Promise<void> {
  const cwd = process.cwd();
  
  // 1. 找 ROADMAP.md
  const roadmapPaths = [
    join(cwd, 'docs/ROADMAP.md'),
    join(cwd, 'docs/features', findFeatureDir(cwd), 'ROADMAP.md'),
  ];
  
  let roadmapPath = roadmapPaths.find(p => existsSync(p));
  if (!roadmapPath) {
    console.log('📋 Product Trace: 未找到 ROADMAP.md');
    console.log('   运行 pt init 初始化项目');
    return;
  }

  const roadmap = parseRoadmap(readFileSync(roadmapPath, 'utf-8'));
  const current = getCurrentSprint(roadmap);
  
  console.log(`📋 Product Trace: feature/${extractFeatureName(roadmapPath)}`);
  console.log();
  
  if (!current) {
    console.log('当前: 无活跃 Sprint');
    console.log('   运行 pt new-sprint 创建新 Sprint');
    return;
  }

  const status = getStoryStatus(current);
  console.log(`当前: ${current.name} — ${current.goal}`);
  
  // 进行中
  const inProgressStories = current.stories.filter(s => s.checkbox === '[~]');
  if (inProgressStories.length > 0) {
    console.log(`进行中: ${inProgressStories.map(s => `${s.checkbox} ${s.id} ${s.title}`).join(', ')}`);
  }
  
  // 待开始
  const pendingStories = current.stories.filter(s => s.checkbox === '[ ]');
  if (pendingStories.length > 0) {
    console.log(`待开始: ${pendingStories.map(s => `${s.id} ${s.title}`).join(', ')}`);
  }
  
  // 阻塞
  const blockedStories = current.stories.filter(s => s.checkbox === '[!]');
  if (blockedStories.length > 0) {
    console.log(`阻塞:   ${blockedStories.map(s => `${s.id} ${s.title} — ${s.note || '原因未注明'}`).join('\n       ')}`);
  }
  
  // 进度
  const completed = status.completed;
  const total = status.total;
  console.log(`进度: ${completed}/${total} (${total > 0 ? Math.round(completed/total*100) : 0}%)`);
  
  console.log();
  
  // 2. 读取 spec.md 检测漂移
  const specPath = findSpecFile(cwd);
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
  
  // 3. 检查 SIGNAL 占位
  const correctionsPath = findCorrectionsFile(cwd);
  if (correctionsPath && existsSync(correctionsPath)) {
    const content = readFileSync(correctionsPath, 'utf-8');
    if (content.includes('SIGNAL')) {
      const signalCount = (content.match(/SIGNAL/g) || []).length;
      console.log(`⚠️ ${signalCount} 条 SIGNAL 占位待升级`);
    }
  }
  
  if (blockedStories.length > 0 || (spec.openCorrections > 0)) {
    console.log();
    console.log('建议: 先处理阻塞项和 CORR，再继续开发');
  }
}

function findFeatureDir(cwd: string): string {
  const featuresDir = join(cwd, 'docs/features');
  if (existsSync(featuresDir)) {
    // 返回第一个 feature 目录
    // 实际实现需要从 ROADMAP 推断
    return '';
  }
  return '';
}

function extractFeatureName(roadmapPath: string): string {
  const match = roadmapPath.match(/features\/([^/]+)/);
  return match ? match[1] : 'main';
}

function findSpecFile(cwd: string): string | null {
  // 搜索 docs/features/*/sprints/sprint-*/spec.md
  // 简化：搜索当前 ROADMAP current sprint 对应的 spec
  return null; // 实际实现需要先解析 ROADMAP 再定位
}

function findCorrectionsFile(cwd: string): string | null {
  // 搜索 corrections-sprint-N.md
  return null;
}
```

**Step 2: 在 index.ts 中注册命令**

```typescript
import { sessionStart } from './commands/session-start';

// 替换之前的占位实现
program
  .command('session-start')
  .description('读 ROADMAP + spec → 检测漂移 → 输出上下文')
  .action(async () => {
    await sessionStart();
    process.exit(0);
  });
```

**Step 3: 构建验证**

```bash
npm run build
node dist/cli/index.js session-start
```
预期：显示 "未找到 ROADMAP.md" 或上下文摘要

**Step 4: 提交**

```bash
git add src/cli/commands/session-start.ts src/cli/index.ts
git commit -m "feat: pt session-start 命令"
```

---

### Task 7: pt session-stop

**文件**：
- Modify: `src/cli/index.ts`
- Create: `src/cli/commands/session-stop.ts`

**Step 1: 实现**

```typescript
import { getDiffStat } from '../lib/git';

export async function sessionStop(): Promise<void> {
  const diff = await getDiffStat();
  
  console.log('--- Product Trace: 会话对账 ---');
  console.log();
  
  if (diff.files.length > 0) {
    console.log('本次修改:');
    diff.files.forEach(f => console.log(`  ${f}`));
    console.log(`  ${diff.summary}`);
  } else {
    console.log('本次修改: 无文件变更');
  }
  
  console.log();
  console.log('请回答（不能跳过）:');
  console.log();
  console.log('1. 进度: 哪些 checkbox 需要更新？');
  console.log('   → 更新 ROADMAP.md');
  console.log();
  console.log('2. 纠偏: spec/ROADMAP/vision 还准吗？');
  console.log('   A. 准 → 刷新 last-verified-against.downstream = HEAD');
  console.log('   B. L0 → 更新 spec §5 + 记 CORR');
  console.log('   C. L1 → 调 product-trace-correct');
  console.log('   D. L2 → 强制调 product-trace-correct');
  console.log('   E. L3 → 回 Discover');
  console.log();
  console.log('3. SIGNAL: 本次标记的占位需要升级吗？');
  console.log('   → 升级为 CORR / 删除');
}
```

**Step 2: 注册命令并验证**

```bash
npm run build
node dist/cli/index.js session-stop
```
预期：显示 diff 和三个问题

**Step 3: 提交**

---

### Task 8: pt init

**文件**：
- Create: `src/cli/commands/init.ts`

**Step 1: 实现 — 创建 docs/ 目录结构**

```typescript
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const FEATURE_SLUG = 'main';

const STRUCTURE = {
  dirs: [
    `docs/features/${FEATURE_SLUG}/sprints`,
  ],
  files: {
    [`docs/features/${FEATURE_SLUG}/ROADMAP.md`]: getRoadmapTemplate(),
    [`docs/features/${FEATURE_SLUG}/product-vision.md`]: getVisionTemplate(),
  },
};

function getRoadmapTemplate(): string {
  return `---
doc: ROADMAP
feature: main
version: 1.0
status: draft
last-updated: ${new Date().toISOString().split('T')[0]}
current-sprint: Sprint 1
open-corrections: 0
---

# ROADMAP — <项目名称>

> 最后更新: ${new Date().toISOString().split('T')[0]}
> 当前 Sprint: Sprint 1 ← current

## 工作流状态
- Discover: ⬜
- Plan: ⬜
- Sprint 1: ← current

## Sprint 1: <Sprint Goal>
- [ ] Story-001: <标题> — <简述>

## Backlog
`;
}

function getVisionTemplate(): string {
  return `---
doc: product-vision
feature: main
version: 1.0
status: draft
last-updated: ${new Date().toISOString().split('T')[0]}
pivot-count: 0
---

# <产品/Feature 名称>

## 1. 问题与机会

## 2. 产品定位

## 3. MVP 范围
| 维度 | 包含 | 不包含 |
|:--|:--|:--|

## 4. 核心概念模型

## 5. 关键风险与技术可行性

## 6. 变更记录
`;
}

export function ptInit(): void {
  const cwd = process.cwd();
  
  console.log('初始化 Product Trace 项目...');
  console.log();
  
  for (const dir of STRUCTURE.dirs) {
    const fullPath = join(cwd, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      console.log(`  ✅ ${dir}/`);
    } else {
      console.log(`  ⏭️ ${dir}/ (已存在)`);
    }
  }
  
  for (const [filePath, content] of Object.entries(STRUCTURE.files)) {
    const fullPath = join(cwd, filePath);
    if (!existsSync(fullPath)) {
      writeFileSync(fullPath, content);
      console.log(`  ✅ ${filePath}`);
    } else {
      console.log(`  ⏭️ ${filePath} (已存在)`);
    }
  }
  
  console.log();
  console.log('初始化完成。下一步:');
  console.log('  1. 编辑 product-vision.md');
  console.log('  2. 运行 /product-trace-discover 开始 Discover');
}
```

**Step 2: 注册命令并验证**

```bash
npm run build
cd /tmp && mkdir pt-test && cd pt-test
node /path/to/dist/cli/index.js init
ls -R docs/
```
预期：目录结构创建成功

**Step 3: 提交**

---

### Task 9: pt status

**文件**：
- Create: `src/cli/commands/status.ts`

**Step 1: 实现 — 读取并展示当前状态**

```typescript
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseRoadmap, getCurrentSprint, getStoryStatus } from '../lib/roadmap';

export function ptStatus(): void {
  const cwd = process.cwd();
  const roadmapPath = join(cwd, 'docs/ROADMAP.md');
  
  if (!existsSync(roadmapPath)) {
    console.log('未找到 ROADMAP.md。运行 pt init 初始化。');
    return;
  }
  
  const roadmap = parseRoadmap(readFileSync(roadmapPath, 'utf-8'));
  const current = getCurrentSprint(roadmap);
  
  console.log('=== Product Trace Status ===');
  console.log();
  
  if (current) {
    console.log(`当前 Sprint: ${current.name}`);
    console.log(`目标: ${current.goal}`);
    const status = getStoryStatus(current);
    console.log(`进度: ${status.completed}/${status.total} ✅ | ${status.inProgress} ~ | ${status.pending} ⬜ | ${status.blocked} ❗`);
    console.log();
    
    for (const story of current.stories) {
      console.log(`  ${story.checkbox} ${story.id}: ${story.title}${story.note ? ` — ${story.note}` : ''}`);
    }
  } else {
    console.log('无活跃 Sprint');
  }
}
```

**Step 2: 注册命令并提交**

---

### Task 10: pt new-sprint / pt progress / pt template

**文件**：各一个 command 文件

这三个命令实现逻辑较简单：
- `new-sprint`：创建 `sprint-N/` 目录 + 空的 spec.md 和 corrections 模板
- `progress`：解析 ROADMAP 统计各 Sprint 完成百分比
- `template <name>`：从 `adapters/claude/templates/` 输出对应模板

**完成后提交**

---

## Phase 4: CC Plugin Adapter

### Task 11: Plugin 目录结构 + plugin.json

**文件**：
- Create: `adapters/claude/.claude-plugin/plugin.json`
- Create: `adapters/claude/hooks/hooks.json`
- Create: `adapters/claude/templates/` 下 7 个模板

**Step 1: plugin.json**

```json
{
  "name": "product-trace",
  "displayName": "Product Trace",
  "version": "1.0.0",
  "description": "产品研发追踪工作流 — 进入会话即知项目在哪、做到哪、该做什么",
  "author": { "name": "Product Trace" },
  "license": "MIT",
  "keywords": ["product", "trace", "roadmap", "sprint"],
  "skills": "./skills/",
  "hooks": "./hooks/hooks.json"
}
```

**Step 2: hooks/hooks.json**

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "pt session-start"
      }]
    }],
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "pt session-stop"
      }]
    }]
  }
}
```

**Step 3: 7 个模板** — 从 design.md 中提取章节模板，放到 `adapters/claude/templates/`

**Step 4: 提交**

---

### Task 12-18: 7 个 SKILL.md

每个 SKILL 放在 `adapters/claude/skills/<name>/SKILL.md`。内容从 design.md 的 SKILL 定义章节提取。

---

## Phase 5: 安装 / 卸载脚本

### Task 19: install.sh

**文件**：
- Create: `install.sh`

**Step 1: 实现交互式安装**

```bash
#!/bin/bash
set -e

echo "=== Product Trace 安装 ==="
echo ""
echo "安装模式:"
echo "  1. 全局 — 安装到 ~/.claude/（所有项目可用）"
echo "  2. 本地 — 安装到当前项目 .claude/（仅当前项目）"
echo ""
read -p "选择 [1/2]: " mode

PLUGIN_SRC="$(cd "$(dirname "$0")" && pwd)/adapters/claude"
CLI_SRC="$(cd "$(dirname "$0")" && pwd)"

case $mode in
  1)
    DEST="$HOME/.claude"
    echo "→ 全局安装到 $DEST"
    
    # 安装 CLI
    cd "$CLI_SRC" && npm install && npm run build && npm link
    
    # 安装 Plugin 组件
    mkdir -p "$DEST/skills/product-trace"
    cp -r "$PLUGIN_SRC/skills/"* "$DEST/skills/product-trace/"
    
    mkdir -p "$DEST/hooks"
    cp "$PLUGIN_SRC/hooks/hooks.json" "$DEST/hooks/product-trace.json"
    
    mkdir -p "$DEST/templates/product-trace"
    cp -r "$PLUGIN_SRC/templates/"* "$DEST/templates/product-trace/"
    ;;
  2)
    DEST="$(pwd)/.claude"
    echo "→ 本地安装到 $DEST"
    
    # 安装 CLI（本地）
    cd "$CLI_SRC" && npm install && npm run build && npm link
    
    # 安装 Plugin 组件
    mkdir -p "$DEST/skills/product-trace"
    cp -r "$PLUGIN_SRC/skills/"* "$DEST/skills/product-trace/"
    
    mkdir -p "$DEST/hooks"
    cp "$PLUGIN_SRC/hooks/hooks.json" "$DEST/hooks/product-trace.json"
    
    mkdir -p "$DEST/templates/product-trace"
    cp -r "$PLUGIN_SRC/templates/"* "$DEST/templates/product-trace/"
    ;;
  *)
    echo "无效选择"
    exit 1
    ;;
esac

echo ""
echo "✅ Product Trace 安装完成"
echo ""
echo "下一步:"
echo "  1. 在项目目录运行 pt init 初始化文档结构"
echo "  2. 重启 Claude Code 或运行 /reload-plugins"
echo "  3. 开始使用 /product-trace-discover"
```

**Step 2: 设置可执行权限并提交**

```bash
chmod +x install.sh
git add install.sh
git commit -m "feat: 安装脚本"
```

---

### Task 20: uninstall.sh

**文件**：
- Create: `uninstall.sh`

```bash
#!/bin/bash
set -e

echo "=== Product Trace 卸载 ==="
echo ""
echo "卸载模式:"
echo "  1. 全局 — 从 ~/.claude/ 移除"
echo "  2. 本地 — 从当前项目 .claude/ 移除"
echo ""
read -p "选择 [1/2]: " mode

case $mode in
  1)
    DEST="$HOME/.claude"
    ;;
  2)
    DEST="$(pwd)/.claude"
    ;;
  *)
    echo "无效选择"
    exit 1
    ;;
esac

echo "→ 从 $DEST 移除 Product Trace..."

rm -rf "$DEST/skills/product-trace"
rm -f "$DEST/hooks/product-trace.json"
rm -rf "$DEST/templates/product-trace"

# 卸载 CLI
npm unlink product-trace 2>/dev/null || true
npm uninstall -g product-trace 2>/dev/null || true

echo "✅ 卸载完成"
echo "注意: docs/ 下的项目文档未删除。如需删除请手动操作。"
```

---

## 实施顺序

```
Phase 1: 骨架
  Task 1 → Task 2
    ↓
Phase 2: 核心库
  Task 3 → Task 4 → Task 5
    ↓
Phase 3: CLI 命令
  Task 6 → Task 7 → Task 8 → Task 9 → Task 10
    ↓
Phase 4: CC Plugin
  Task 11 → Task 12-18
    ↓
Phase 5: 安装脚本
  Task 19 → Task 20
```

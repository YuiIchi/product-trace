# .product-trace/ Namespace Migration & Brownfield Adoption Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 Product Trace 的工作目录从 `docs/features/` 迁移到 `.product-trace/`，并在 Discover SKILL 中加入棕地接入分支。

**Architecture:** 所有文档路径统一收到 `.product-trace/features/<slug>/` 下。命令层只管机械读写，Agent 通过 SKILL 判断场景（全新/棕地/已接入）。棕地接入只是 Discover SKILL 的一个分支——Agent 扫描代码 → 生成 vision + roadmap(Sprint 0 全 [x] + Sprint 1 ← current) → 进入 Plan。

**Tech Stack:** TypeScript (CLI) + Markdown (SKILLs + 模板) + Vitest (测试)

**核心原则（来自 CLAUDE.md）：** 改 SKILL → 检查模板/命令；改命令 → 检查 SKILL/模板；改模板 → 检查 SKILL/命令。`npm run build` + `npx vitest run` 必须全通过。

---

## 涉及文件清单

| 层 | 文件 | 改动类型 |
|:--|:--|:--|
| 命令 | `src/cli/commands/init.ts` | 路径迁移 |
| 命令 | `src/cli/commands/session-start.ts` | 路径迁移 |
| 命令 | `src/cli/commands/new-sprint.ts` | 路径迁移 |
| 命令 | `src/cli/lib/project.ts` | 路径迁移 |
| 命令 | `src/cli/__tests__/commands.test.ts` | 路径迁移 |
| SKILL | `product-trace-discover/SKILL.md` | 路径迁移 + 棕地分支 |
| SKILL | `product-trace-plan/SKILL.md` | 路径迁移 |
| SKILL | `product-trace-design/SKILL.md` | 路径迁移 |
| SKILL | `product-trace-new-requirement/SKILL.md` | 路径迁移 |
| CLI入口 | `src/cli/index.ts` | 描述文案更新 |
| 脚本 | `uninstall.sh` | 提示文案更新 |
| 用例 | `cases/product-trace/trigger/discover.yaml` | 路径迁移 |
| 用例 | `cases/product-trace/workflow/build-tdd.yaml` | 路径迁移 |
| 规范 | `CLAUDE.md` | 路径迁移 |

---

### Task 1: 迁移 `project.ts` — 所有路径查找函数

**文件:**
- Modify: `src/cli/lib/project.ts`

**改动点：**

1. `findRoadmap()`: 将搜索路径从 `docs/roadmap.md` + `docs/features/*/roadmap.md` 改为 `.product-trace/features/*/roadmap.md`
2. `findCorrectionsFile()`: 将搜索根目录从 `docs/features` 改为 `.product-trace/features`
3. 更新注释中的路径说明

**Step 1: 编辑文件**

将 `findRoadmap` 简化为（移除 `docs/roadmap.md` 旧路径——`.product-trace/` 是唯一命名空间，不再兜底）：

```typescript
export function findRoadmap(cwd: string): string | null {
  const featuresDir = join(cwd, '.product-trace', 'features');
  if (existsSync(featuresDir)) {
    try {
      const entries = readdirSync(featuresDir);
      for (const entry of entries) {
        const path = join(featuresDir, entry, 'roadmap.md');
        if (existsSync(path)) return path;
      }
    } catch {}
  }
  return null;
}
```

将 `findCorrectionsFile` 中的 `featuresDir` 改为：

```typescript
const featuresDir = join(cwd, '.product-trace', 'features');
```

**Step 2: 运行测试确认破坏**

```bash
cd /Users/yui/Development/AI/product-trace/.worktrees/impl && npx vitest run
```

预期：部分测试失败（因为 init/new-sprint 还在写旧路径）

---

### Task 2: 迁移 `init.ts` — 创建 `.product-trace/` 目录结构

**文件:**
- Modify: `src/cli/commands/init.ts`

**改动点：**

1. 目录路径 `docs/features/${FEATURE_SLUG}/sprints` → `.product-trace/features/${FEATURE_SLUG}/sprints`
2. product-vision.md 路径 → `.product-trace/features/${FEATURE_SLUG}/product-vision.md`
3. roadmap.md 路径 → `.product-trace/features/${FEATURE_SLUG}/roadmap.md`
4. 更新终端输出和 `.gitignore` 中的注释

**Step 1: 编辑 `init.ts`**

- 第22行：`docs/features/${FEATURE_SLUG}/sprints` → `.product-trace/features/${FEATURE_SLUG}/sprints`
- 第37行：`docs/features/${FEATURE_SLUG}/product-vision.md` → `.product-trace/features/${FEATURE_SLUG}/product-vision.md`
- 第59行：`docs/features/${FEATURE_SLUG}/roadmap.md` → `.product-trace/features/${FEATURE_SLUG}/roadmap.md`

---

### Task 3: 迁移 `new-sprint.ts`

**文件:**
- Modify: `src/cli/commands/new-sprint.ts`

**改动点：**

1. `findRoadmapFile()` 中的硬编码路径 `docs/features/main/roadmap.md` → `.product-trace/features/main/roadmap.md`
2. `featuresDir` 从 `docs/features` → `.product-trace/features`

**Step 1: 编辑 `new-sprint.ts`**

- 第8行：`join(cwd, 'docs/features/main/roadmap.md')` → `join(cwd, '.product-trace/features/main/roadmap.md')`
- 第13行：`join(cwd, 'docs/features')` → `join(cwd, '.product-trace', 'features')`
- 同时更新 `docs/roadmap.md` 的备选路径 → `.product-trace/roadmap.md`（或直接移除旧路径）

---

### Task 4: 迁移 `session-start.ts`

**文件:**
- Modify: `src/cli/commands/session-start.ts`

**改动点：**

1. `featureMatch` 正则匹配路径从 `features/([^/]+)` → 保持不变（`findRoadmap` 返回的路径已包含 `features/<slug>/roadmap.md`，正则不变）
2. 无 `.product-trace/` 时的输出提示调整

核实：`session-start.ts` 本身没有硬编码 `docs/` 路径，它通过 `findRoadmap()` 获取路径。唯一需要更新的是：

- 第48行 `featureMatch` 正则 `/features\/([^/]+)/` — 这个仍然匹配 `.product-trace/features/<slug>/roadmap.md`，不需要改
- 第31-33行：未找到 roadmap 时的提示调整为「运行 `pt init` 或确认项目已接入 Product Trace」

---

### Task 5: 迁移测试文件

**文件:**
- Modify: `src/cli/__tests__/commands.test.ts`

**改动点：** 全局替换 `docs/features/main/` → `.product-trace/features/main/`

共 14 处：
- 第46-48行：existsSync 检查
- 第52行：product-vision.md 读取
- 第59行：roadmap.md 读取
- 第82-84行：sprint 目录和文件检查
- 第88行：spec.md 读取
- 第102行：corrections 读取
- 第110行：sprint-2 检查
- 第129行：roadmapPath 构造
- 第153行：roadmapPath 构造
- 第164行：roadmapPath 构造

---

### Task 6: 更新 SKILL 中的路径引用（4 个 SKILL）

**文件:**
- Modify: `adapters/claude-code/skills/product-trace-discover/SKILL.md`
- Modify: `adapters/claude-code/skills/product-trace-plan/SKILL.md`
- Modify: `adapters/claude-code/skills/product-trace-design/SKILL.md`
- Modify: `adapters/claude-code/skills/product-trace-new-requirement/SKILL.md`

**改动点：** 全局替换 `docs/features/` → `.product-trace/features/`

| SKILL | 行号 | 原文 |
|:--|:--|:--|
| discover | 12 | `docs/features/<feature-slug>/product-vision.md` |
| discover | 41 | `docs/features/<feature-slug>/product-vision.md` |
| plan | 12 | `docs/features/<feature-slug>/roadmap.md` |
| design | 14 | `docs/features/<feature>/sprints/sprint-N/spec.md` |
| new-requirement | 22 | `docs/features/` |
| new-requirement | 41 | `docs/features/<new-slug>/` |

---

### Task 7: 扩展 Discover SKILL — 加入棕地接入分支

**文件:**
- Modify: `adapters/claude-code/skills/product-trace-discover/SKILL.md`

**改动内容：** 在"什么时候该用我"段之前插入一个新段 "## 场景判断"，在"一步步做"的 Step 1 之前插入棕地路径。

新增内容：

```markdown
## 场景判断

Agent 进来后首先判断场景（不依赖命令——命令只读写文件）：

1. **`.product-trace/` 存在** → 已接入。读 `roadmap.md` 确认当前 Sprint，走正常流程。
2. **`.product-trace/` 不存在 + 项目有代码**（有 `src/`、`package.json`、`.git` 等）→ **棕地接入**。见下方「棕地接入」段。
3. **`.product-trace/` 不存在 + 无代码** → 全新项目。见下方「全新项目」段。

## 棕地接入

当项目已有代码但未接入 Product Trace 时：

**1. 快速扫描**：读 `package.json`/`README.md`/目录结构，理解：
- 技术栈（语言、框架、数据库）
- 核心功能模块（从目录结构和入口文件推断）
- 测试命令（从 `package.json` scripts 提取）

**2. 对话确认**：用 2-3 轮对话向用户确认你的理解是否正确。

**3. 生成文档**（一次性写，不全量确认——这不是新 Discover，是快照）：

写入 `.product-trace/features/<slug>/product-vision.md`：
- status: `adopted`
- §3 MVP 范围：包含列为已识别出的已有功能
- §4 核心概念：从代码结构推断
- §5 风险：留 "待补充"

写入 `.product-trace/features/<slug>/roadmap.md`：
```markdown
---
doc: ROADMAP
feature: <slug>
version: 1.0
status: active
last-updated: <today>
current-sprint: Sprint 1
open-corrections: 0
---

# ROADMAP — <项目名>

## 工作流状态
- Adopt: ✅ (从现有代码接入)
- Sprint 1: ← current

## Sprint 0: 已有基础 ✅
- [x] Story-001: <已识别功能1>
- [x] Story-002: <已识别功能2>

## Sprint 1: <下一个要做的>
- [ ] Story-003: <待确认>

## Backlog
```

写入 `.product-trace/features/<slug>/architecture.md`：
- §2 技术选型：从 `package.json` 等自动提取

**4. 进入 Plan**：告知用户 "项目已接入。下一步 `/product-trace-plan` 规划 Sprint 1。"

## 全新项目

走现有 Discover 流程：逐轮对话 → 边写边确认 → 最后改 status: stable。
```

---

### Task 8: 更新 CLI 入口描述 + 卸载脚本 + 用例文件

**文件:**
- Modify: `src/cli/index.ts`
- Modify: `uninstall.sh`
- Modify: `cases/product-trace/trigger/discover.yaml`
- Modify: `cases/product-trace/workflow/build-tdd.yaml`

**改动点：**

`src/cli/index.ts:36`:
```
'初始化 docs/ 目录结构 + 创建模板' → '初始化 .product-trace/ 目录结构 + 创建模板'
```

`uninstall.sh:51`:
```
'注意: docs/ 下的项目文档未被删除' → '注意: .product-trace/ 下的项目文档未被删除'
```

`cases/product-trace/trigger/discover.yaml:55`:
```
docs/features/main/ → .product-trace/features/main/
```

`cases/product-trace/workflow/build-tdd.yaml:15,17`:
```
docs/features/main/sprints/sprint-1 → .product-trace/features/main/sprints/sprint-1
```

---

### Task 9: 更新 CLAUDE.md

**文件:**
- Modify: `CLAUDE.md`

**改动：** 第38行 `docs/features/<feature-slug>/sprints/sprint-N/` → `.product-trace/features/<feature-slug>/sprints/sprint-N/`

---

### Task 10: 全量验证

**Step 1: Build**
```bash
cd /Users/yui/Development/AI/product-trace/.worktrees/impl && npm run build
```
预期：编译通过，无类型错误。

**Step 2: Test**
```bash
cd /Users/yui/Development/AI/product-trace/.worktrees/impl && npx vitest run
```
预期：30 个测试全通过（路径已全部更新）。

**Step 3: 手工冒烟**
```bash
cd /tmp && rm -rf pt-test-adopt && mkdir pt-test-adopt && cd pt-test-adopt
pt init
# 验证 .product-trace/features/main/product-vision.md 存在
# 验证 .product-trace/features/main/roadmap.md 存在
# 验证旧 docs/ 目录不存在
pt template roadmap  # 确认模板正常输出
```

---

### Task 11: 提交

```bash
git add -A
git commit -m "feat: .product-trace/ namespace + brownfield adoption

- 所有文档路径从 docs/features/ 迁移到 .product-trace/features/
- pt init 创建 .product-trace/ 目录结构
- project.ts 搜索路径更新
- SKILL 路径引用全部更新
- Discover SKILL 新增棕地接入分支（扫描代码 → 生成 vision+roadmap → Plan）
- 30 测试全通过

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Architect Review Notes (non-blocking, for follow-up)

1. **Sprint 0 不创建目录**：棕地接入生成 roadmap.md 时，Sprint 0 仅存在于文档中。不运行 `pt new-sprint` 创建 `sprint-0/`。Discover SKILL 中需明确说明这一点——否则 `pt new-sprint` 的 `existingSprints.length + 1` 计数会偏移。

2. **DRY — `findRoadmap` 重复**：`new-sprint.ts` 的 `findRoadmapFile()` 和 `project.ts` 的 `findRoadmap()` 功能重复。后续可让 `new-sprint.ts` 直接 import `findRoadmap`，本次不改（减少风险）。

3. **已有项目迁移**：本计划只改路径 schema。对于 Product Trace 项目本身存在的 `docs/features/main/` 目录，手动执行 `mv docs/features .product-trace/features`。

4. **`.product-trace/` 可见性**：dot-prefix 在某些文件管理器中隐藏目录。Discover SKILL 的"做完之后"段需告知用户文档位置。

---
name: product-trace-design
description: Sprint 详细设计。当 ROADMAP 当前 Sprint 有 Story 待展开时 MUST 使用此 SKILL。展开用户旅程、验收标准、数据模型、Task 拆解。产出 sprint-N/spec.md——Sprint 内唯一执行手册。关键词：用户旅程、验收标准、AC、数据模型、Task拆解、Sprint设计。
---

# Product Trace — Design（Sprint 设计）

## Product Trace 是什么

Product Trace 是一套产品研发追踪框架。它把产品从想法到交付的全过程，用一套相互引用的文档和 CLI 命令串成可追踪的链——任何时候进入会话，Agent 都能自动知道项目是什么、做到哪了、该做什么。

### 完整工作流（7 个 SKILL）

```
  Discover  →  Plan  →  Design  →  Build  →  Verify
  (vision)    (ROADMAP)  (spec)    (代码)    (验收报告)

  旁路 1: Build 中发现设计偏差 → Correct（L0-L3 分级纠偏 + CORR 留痕）
  旁路 2: 任何阶段新需求到达 → New Requirement（增量/Feature/紧急 三级门控）
```

每个 SKILL 有明确的前置条件和交接点。你当前是链条的第一环——**Discover**。

### 文档体系

所有文档存在 `docs/features/<feature-slug>/` 下，一条链递进：

| 文件 | 谁产出 | 作用 | 生存周期 |
|:--|:--|:--|:--|
| `product-vision.md` | Discover | 为什么做：问题、定位、MVP 范围、Go/No-Go | 极少改，pivot 时归档 |
| `ROADMAP.md` | Plan | 做什么+做到哪了：功能和进度的唯一真相源。全项目只有这一份 | 每次会话更新 checkbox |
| `architecture.md` | Plan | 技术架构：选型、数据模型、ADR | 架构变更时更新 |
| `sprint-N/spec.md` | Design | 怎么做才算对：用户旅程、AC、数据模型、Task 拆解 | Sprint 内活跃，完成后归档 |
| `acceptance/vN.md` | Verify | 验收报告：逐 AC 验证结果+证据+漂移审计 | Sprint 完成时产出 |
| `corrections-sprint-N.md` | Build/Verify 中 | 纠偏日志：CORR 条目 + SIGNAL 占位 | Sprint 内追加 |

### pt CLI 命令

所有命令通过 Bash 工具执行。`pt` 已全局安装。

| 命令 | 用途 | 常用场合 |
|:--|:--|:--|
| `pt init` | 初始化项目的 docs/ 目录结构和模板 | 新项目第一步 |
| `pt session-start` | 读取 ROADMAP + spec，输出当前 Sprint/Story/漂移 | 每次进入会话 |
| `pt session-stop` | git diff + 强制对账三问 | 每次退出会话 |
| `pt status` | 展示当前 Sprint、Story checkbox 状态、Backlog | 随时查看进度 |
| `pt progress` | 进度条 + 各 Sprint 完成率统计 | 随时查看进度 |
| `pt new-sprint` | 创建 sprint-N/ 目录 + spec.md + corrections 模板 | 新 Sprint 开始 |
| `pt template <name>` | 输出指定模板内容 | 需要模板参考时 |

### 核心概念

| 概念 | 说明 | 在哪体现 |
|:--|:--|:--|
| Feature | 一个独立的产品模块，用 slug 命名（如 `todo-app`）。docs/ 下一个 feature 一个目录 | `docs/features/<feature-slug>/` |
| ROADMAP | **全项目唯一真相源**。同时承担功能清单+优先级+Sprint划分+进度跟踪四职责 | `ROADMAP.md`，每次 `pt session-start` 读取 |
| Sprint | 一组 Story 的集合，有一个一句话 Goal。按用户旅程段组织 | ROADMAP 的 `## Sprint N:` 段 |
| Story | 一个可独立交付的功能增量，格式 `Story-XXX: <标题>` | ROADMAP 中 `- [ ] Story-XXX: <标题>` |
| Checkbox 四态 | `[ ]` 未开始 → `[~]` 进行中 → `[x]` 已完成 → `[!]` 阻塞 | ROADMAP 每行 Story 前 |
| ← current | 标记当前活跃的 Sprint。frontmatter `current-sprint` 是真相源，heading 标记是装饰 | ROADMAP heading + frontmatter |
| spec.md | Sprint 的唯一执行手册。Build 和 Verify 只参考此文件 | `sprint-N/spec.md` |
| AC | 验收标准，每条必须附验证方式（命令或手动步骤），不可测试的描述不算 AC | spec §2 |
| CORR | 设计偏差记录。L0=技术细节/L1=AC/L2=Scope/L3=方向 | `corrections-sprint-N.md` |
| SIGNAL | Build 中临时标记，会话结束时升级为 CORR 或删除 | corrections 的 `## SIGNAL 占位` |
| Drift | 文档与代码现实之间的偏移。spec `last-verified-against.downstream` vs HEAD | `pt session-start` 自动检测 |
| Front-matter | 每个文档头部的 YAML 元数据，含 version/status/last-verified-against | 所有文档顶部 `---` 块 |


## → 你现在是 Design——第三环，产出 sprint-N/spec.md，把 ROADMAP 的 Story 展开为可执行、可验收的细案。

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt new-sprint` | 创建 sprint-N/ 目录结构（spec.md + corrections 文件） |
| `pt template spec` | 输出 spec.md 模板 |

通过 Write 工具写入 `docs/features/<feature>/sprints/sprint-N/spec.md`。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| 用户旅程 | 从用户视角描述本 Sprint 的完整交互流，每个场景含步骤、状态（Loading/Empty/Error/Edge） |
| 验收标准（AC） | 可测试的完成条件，每条必须附验证方式（命令或手动步骤） |
| 数据模型 | 本 Sprint 新增/变更的实体和字段 |
| Task | 实施拆解的最小单位，一个 Task = 一个可独立验证的功能增量 |

## 执行流程

### Step 1：了解当前状态

运行 `pt session-start` 确认当前 Sprint。读取 ROADMAP 中当前 Sprint 的 Story 列表。如果上一 Sprint 有 corrections 日志，读取其中高频纠偏模式，在本 Sprint 主动强化对应方面。

### Step 2：创建 Sprint 目录

运行 `pt new-sprint`，自动创建 `sprint-N/spec.md` 和 `corrections-sprint-N.md`。

### Step 3：展开用户旅程

从用户视角描述本 Sprint 的交互流。每个场景包含：

```markdown
### 场景: <场景名>
**前置条件**: ...
**步骤**:
1. 用户做 X → 系统显示 Y
   - Loading: <行为>
   - Empty: <行为>
   - Error: <行为>
   - Edge: <边界情况>
```

**分段确认**：每写完一个场景，向用户确认"这个流程对吗？"

### Step 4：展开验收标准

每条 AC 格式：
```markdown
- [ ] AC-1: <可测试的描述>
  验证方式: <命令或手动步骤>
```

例如：
```markdown
- [ ] AC-1: 输入"买牛奶"回车后，任务出现在列表顶部
  验证方式: 单测 `addTask('买牛奶')` + 断言渲染结果第一项
```

覆盖所有状态：Loading / Empty / Error / Edge cases。

### Step 5：设计数据模型

列出本次 Sprint 新增/变更的实体和字段：

```markdown
| 实体 | 字段 | 类型 | 必填 | 说明 |
|:--|:--|:--|:--|:--|
| Task | id | string | ✅ | crypto.randomUUID() |
```

### Step 6：拆解 Task

每个 Story 拆成 1-3 个 Task：
```markdown
### Story-001: <标题>
#### Task 1: <标题>
- 目标: 一句话
- 涉及文件: `src/store.ts`
- 完成标准: 单测 pass，addTask 返回 Task 对象
```

### Step 7：技术方案（如需）

本 Sprint 有架构级决策时写 §5 技术方案。非架构级省略。

### Step 8：交接下一步

spec.md 写完后告知用户下一步用 `/product-trace-build` 开始实现。

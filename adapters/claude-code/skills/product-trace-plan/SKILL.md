---
name: product-trace-plan
description: 产品规划。当 product-vision.md 已完成且用户说 Go 后 MUST 使用此 SKILL。你将作为架构师+PM，进行功能拆分、优先级排序、Sprint 划分。产出 ROADMAP.md 和 architecture.md。关键词：规划、Roadmap、Sprint、Story、优先级、架构、技术选型。
---

# Product Trace — Plan（产品规划）

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


## → 你现在是 Plan——第二环，产出 ROADMAP.md，把 vision 转化为可执行的计划。

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt template ROADMAP` | 输出 ROADMAP.md 模板 |
| `pt template architecture` | 输出 architecture.md 模板 |

通过 Write 工具写入 `docs/features/<feature-slug>/ROADMAP.md` 和 `docs/features/<feature-slug>/architecture.md`。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| Story | 一个可独立交付的功能增量，一句话描述交付物。格式：`Story-001: 用户可注册账号` |
| Sprint | 一组 Story 的集合，有明确的 Goal。每个 Sprint 交付一段用户可验收的体验 |
| P0/P1/P2/P3 | 优先级。P0 = 不做代价比做更大 |
| Checkbox | ROADMAP 中每个 Story 的状态标记：`[ ]` 未开始、`[~]` 进行中、`[x]` 已完成、`[!]` 阻塞 |

## 执行流程

### Step 1：读取 vision

读取 `docs/features/<feature-slug>/product-vision.md`。确认 `status: stable` 且用户已说 Go。

### Step 2：功能拆分

从 vision 的 MVP 范围中提取功能点。每个功能能用一个 Story 描述。例如 vision 说"创建任务、列表展示、标记完成"，拆成：
- Story-001: 创建任务
- Story-002: 任务列表展示
- Story-003: 标记完成

### Step 3：优先级排序

按 P0/P1/P2/P3 分级。有依赖关系的功能放在同一 Sprint 或相邻 Sprint。

向用户确认优先级排序是否合理。

### Step 4：Sprint 划分

按用户体验段组织 Sprint。每个 Sprint：
- 有明确的 Goal（一句话说清交付后用户能干什么）
- 包含 2-5 个 Story
- 第一个 Sprint 最小但完整（能独立演示）

### Step 5：写入 ROADMAP.md

用 Write 工具写入 `docs/features/<feature-slug>/ROADMAP.md`。

**ROADMAP.md 结构**：

```yaml
---
doc: ROADMAP
feature: <feature-slug>
version: 1.0
status: draft
last-updated: YYYY-MM-DD
current-sprint: Sprint 1
open-corrections: 0
---
```

正文包含：
- `## 工作流状态` — 当前各阶段完成情况
- `## Sprint N: <Goal>` — 每个 Sprint 一个段落，Story 用 `- [ ] Story-XXX: <标题>` 格式
- Sprint 1 的标题后标注 `← current`
- `## Backlog` — 未来的 Story
- `## 变更记录` — 版本变更表

向用户确认 ROADMAP 的 Sprint 划分是否合理。

### Step 6：架构文档（如需要）

如果有技术选型（框架、存储、部署方式等）需要决策，写入 `docs/features/<feature-slug>/architecture.md`。

**architecture.md 结构**：
- `## 1. 架构概览` — 分层图/组件关系图 + 说明
- `## 2. 技术选型` — 表格：层/选择/理由/备选
- `## 3. 核心数据模型` — 核心实体关系
- `## 4. 关键决策记录（ADR）` — 决策+理由+替代方案+权衡

无技术选型时可跳过此步。

### Step 7：交接下一步

ROADMAP 和 architecture 写完后，告知用户下一步用 `/product-trace-design` 展开 Sprint 1 的详细设计。

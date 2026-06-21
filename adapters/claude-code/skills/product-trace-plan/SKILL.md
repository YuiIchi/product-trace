---
name: product-trace-plan
description: 产品规划。当 product-vision.md 已完成且用户说 Go 后 MUST 使用此 SKILL。你将作为架构师+PM，进行功能拆分、优先级排序、Sprint 划分。产出 ROADMAP.md 和 architecture.md。关键词：规划、Roadmap、Sprint、Story、优先级、架构、技术选型。
---

# Product Trace — Plan（产品规划）

## 背景知识

Product Trace 的链条中，Plan 是第二环——把 vision 转化为可执行的计划。

```
product-vision.md  →  ROADMAP.md  →  sprint-N/spec.md  →  代码
         ✅              ← 你现在做这个
```

**ROADMAP.md 是整套体系中最核心的文件**。它同时承担四个职责：功能清单 + 优先级排序 + Sprint 划分 + 进度跟踪。之后每个会话的 `pt session-start` 都会读取它来恢复上下文。

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

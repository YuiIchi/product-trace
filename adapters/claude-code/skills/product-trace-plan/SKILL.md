---
name: product-trace-plan
description: "产品规划阶段。产品目标书已确认且用户说了 Go、但还没有路线图时 MUST 使用此 SKILL。你将拆分功能、排优先级(P0/P1/P2/P3)、划分 Sprint、产出全项目唯一的进度追踪文件 roadmap.md，有技术选型时同步产出 architecture.md。关键词：规划、Roadmap、Sprint、Story、优先级。"
---

# Plan — 产品规划

## 你的位置

前面 Discover 已经产出了产品目标书（product-vision.md），确认了"为什么做、做什么、不做哪些"。现在你是第二环——**把这份目标书拆成一张可执行的路线图，让所有人都知道：哪些功能要做、先做哪个后做哪个、做到哪了**。

这份路线图叫 `docs/features/<feature-slug>/roadmap.md`。它是全项目最重要的文件——同时承担四个角色：功能清单、优先级排序、Sprint 划分、进度跟踪。之后每一个会话启动时，Agent 都靠读它来恢复上下文（"项目是什么、做到哪了、该做什么"）。如果项目有技术选型需要决策，还会产出一份架构说明 `architecture.md`。

**文档链**：我产出 roadmap.md（含 Sprint 划分和 Story 清单）+ architecture.md → Design 阶段读取 roadmap 当前 Sprint 的 Story 来展开用户旅程和验收标准。

## 什么时候该用我

- product-vision.md 已经写好（status: stable）且用户明确说了 Go
- roadmap.md 还不存在或只是初始模板
- 如果 ROADMAP 已经存在且完成了 Sprint 划分——说明 Plan 做过了，引导用户去 `/product-trace-design`

## 核心概念

做规划前先理解几个概念，它们会在 roadmap 中反复出现：

- **Story**：一个可独立交付的功能增量。一行描述一个。比如 "Story-001: 用户可创建待办任务"
- **Sprint**：一组 Story 的集合，有一个明确的交付目标。比如 "Sprint 1: 用户可以创建和查看任务列表"
- **P0/P1/P2/P3**：优先级。P0 是最高的——不做 P0 的代价比做更大
- **Checkbox**：每个 Story 前面的状态标记——`[ ]` 还没开始、`[~]` 正在做、`[x]` 做完了、`[!]` 卡住了

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt template roadmap` | 输出路线图的标准模板 |
| `pt template architecture` | 输出架构说明的标准模板 |

## 一步步做

**1. 读目标书**：先读 product-vision.md，确认 status: stable 和 Go 决策。

**2. 拆功能**：把 MVP 范围里的每个功能点写成一个 Story。每个 Story 一句话说清楚交付什么。

**3. 排优先级**：按 P0/P1/P2/P3 排。有依赖关系的 Story 放同一 Sprint 或相邻 Sprint。把优先级表给用户确认。

**4. 划 Sprint**：把 Story 分到不同 Sprint 里。每个 Sprint 2-5 个 Story，有一个清晰的交付目标（一句话能说清楚"这个 Sprint 做完用户能干什么"）。**第一个 Sprint 最小但完整——能独立演示**。给用户确认。

**5. 写 roadmap**：用 Write 工具写 `roadmap.md`。所有 Story 初始 `[ ]`。第一个 Sprint 的标题后面标注 `← current`，文件头部 frontmatter 里写 `current-sprint: Sprint 1`。

**6. 写架构**（如果需要）：项目涉及技术选型（用什么语言/框架/数据库/部署方式）时，用 Write 写 `architecture.md`——技术选型表（选了什么+为什么+备选）、核心数据模型、关键决策记录。不需要选型就跳过这步。

**7. 写 UI 规范**（有前端时必须）：用 Write 写 `ui-design-system.md`——设计令牌（色彩/字体/间距/圆角/阴影的具体值）、组件库（每个组件的变体+状态+使用场景）、布局规范、交互规范。Design 的 prototype 和 Build 的代码都以此为准。

## 做完之后

告诉用户："路线图已就绪。下一步用 `/product-trace-design` 把当前 Sprint 的 Story 展开成详细的执行手册。"

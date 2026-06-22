---
name: product-trace-plan
description: "产品规划阶段。产品目标书已确认且用户说了 Go、但还没有路线图时 MUST 使用此 SKILL。你将拆分功能、排优先级(P0/P1/P2/P3)、划分 Sprint、产出全项目唯一的进度追踪文件 roadmap.md，有技术选型时同步产出 architecture.md。关键词：规划、Roadmap、Sprint、Story、优先级。"
---

# Plan — 产品规划

## 你的位置

前面 Discover 已经产出了产品目标书（product-vision.md），确认了"为什么做、做什么、不做哪些"。现在你是第二环——**把这份目标书拆成一张可执行的路线图，让所有人都知道：哪些功能要做、先做哪个后做哪个、做到哪了**。

这份路线图叫 `.product-trace/features/<feature-slug>/roadmap.md`。它是全项目最重要的文件——同时承担四个角色：功能清单、优先级排序、Sprint 划分、进度跟踪。每一个会话启动时，Agent 都靠读它来恢复上下文。如果项目有技术选型需要决策，还会产出一份架构说明 `architecture.md`。

**文档链**：我产出 roadmap.md（含 Sprint 划分和 Story 清单）+ architecture.md → Design 阶段读取 roadmap 当前 Sprint 的 Story 来展开用户旅程和验收标准。

## 什么时候该用我

- product-vision.md 已经写好（status: stable 或 status: adopted）且用户明确说了 Go
- roadmap.md 还不存在或只是初始模板
- 如果 ROADMAP 已经存在且完成了 Sprint 划分——说明 Plan 做过了，引导用户去 `/product-trace-design`

## 核心概念

做规划前先理解几个概念，它们会在 roadmap 中反复出现：

- **Story**：一个可独立交付的**用户可见**功能增量。不是技术任务，不是"搭数据库"——是"用户能做什么"。一行描述一个。
- **Sprint**：一组 Story 的集合，有一个明确的交付目标。做完这个 Sprint，用户能完成一个完整的任务闭环。
- **P0/P1/P2/P3**：优先级。见下方优先级框架。
- **Checkbox**：每个 Story 前面的状态标记——`[ ]` 还没开始、`[~]` 正在做、`[x]` 做完了、`[!]` 卡住了。

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt template roadmap` | 输出路线图的标准模板 |
| `pt template architecture` | 输出架构说明的标准模板 |

## 一步步做

### 1. 读目标书，锁定 MVP 边界

读 product-vision.md 的 §3 MVP 范围表。"包含"列是你要拆成 Story 的输入，"不包含"列是红线——不允许出现在任何 Story 里。

确认 status: stable 或 adopted，确认 Go 决策。用 1-2 句话向用户复述你理解的边界。

### 2. 拆 Story

把 MVP"包含"列的每个功能点拆成一个或多个 Story。拆之前先理解什么是好 Story：

| 维度 | 好 Story | 坏 Story |
|:--|:--|:--|
| **用户可见** | 用户可创建待办任务 | 实现 Todo 数据表 |
| **独立可测** | 做完这一个就能演示 | 必须等 A、B 一起做完 |
| **一句话说清** | 用户可搜索已创建的任务 | 实现搜索功能（包括索引、分词、排序...） |
| **适合粒度** | 一个 Sprint 内 2-5 个 Story | 一个 Story 就要做一个 Sprint |

**拆分方法**：从用户的角度走一遍产品。用户先做什么？然后做什么？每个"做什么"就是一个 Story。

例：product-vision §3 包含项 "任务管理" →
- Story-001: 用户可创建待办任务
- Story-002: 用户可查看任务列表
- Story-003: 用户可将任务标记为完成
- Story-004: 用户可删除任务

每个 Story 编号 Story-001、Story-002...，一句话说清交付什么。

### 3. 排优先级

给每个 Story 标 P0/P1/P2/P3。不是凭感觉——按以下标准：

| 优先级 | 标准 | 判断依据 |
|:--|:--|:--|
| **P0** | 没有它，MVP 没有价值 | 用户的核心问题无法解决。删掉它，产品就不成立。 |
| **P1** | 核心闭环需要，但可延后 | 用户能走通主流程但体验打折。下一个 Sprint 必须做。 |
| **P2** | 锦上添花 | 没有也不影响核心价值。用户会想要但不阻塞。 |
| **P3** | 以后再说 | 明确不做进前几个 Sprint。记入 Backlog 但不管。 |

**规则**：
- P0 Story 数量 ≤ 总 Story 的 40%。如果超了——你在把"想要"当"必须"
- 每个优先级至少有一个 Story（否则该优先级没意义）
- 确认时告诉用户："删掉 P0 以外的所有 Story，产品还有价值吗？有→P0 对了。没有→漏了。"

把优先级表给用户确认。

### 4. 划 Sprint

把 Story 分配到 Sprint。每个 Sprint 2-5 个 Story。规则：

**Sprint 1 必须是"最小完整演示"**——做完 Sprint 1，用户能独立完成一件事，能看到产品价值。如果 Sprint 1 只做了"登录"但登录后什么也做不了——那是坏的 Sprint 1。

**依赖排序**：如果 Story B 必须 Story A 先做完才能做，A 和 B 放同一 Sprint 或相邻 Sprint。不跨 Sprint 的依赖优先。

**每个 Sprint 有明确目标**：一句话说清"这个 Sprint 做完后用户能干什么"。例如：
- 好：Sprint 1: 用户可以创建和查看任务列表
- 坏：Sprint 1: 完成基础功能

**按优先级填**：P0 → Sprint 1、Sprint 2。P1 → 后续 Sprint。P2/P3 → Backlog。

划完后给用户确认 Sprint 划分。

### 5. 写 roadmap

用 Write 写 `.product-trace/features/<feature-slug>/roadmap.md`：

- frontmatter: `current-sprint: Sprint 1`、`open-corrections: 0`
- 第一个 Sprint 标题后标注 `← current`
- 所有 Story checkbox 初始 `[ ]`
- 包含 Backlog 段放 P2/P3 Story
- 包含 `## 工作流状态` 段——Plan 标记为完成，Sprint 1 标记为 current

### 6. 写架构（触发条件：有技术选型需要决策）

只有以下情况才需要写 `architecture.md`：
- 项目需要选语言/框架/数据库/部署方式（还没定）
- 有多个可行方案需要权衡
- 棕地接入时自动从 `package.json` 等提取

内容：技术选型表（选了什么 + 为什么 + 备选是什么）、核心数据模型、关键决策记录（ADR）。不需要选型就跳过这步——**不强加文档**。

### 7. 写 UI 规范（触发条件：有前端）

有前端界面时必须写 `ui-design-system.md`。内容：
- **设计令牌**：色彩、字体、间距、圆角、阴影——给具体值，不写"待定"
- **组件库**：Button/Input/Card/Modal 等，每个列出变体 + 状态 + 使用场景
- **布局规范**：最大宽度、响应式断点、网格规则
- **交互规范**：四态要求（Loading/Empty/Error/Edge）、反馈时间、动画、可访问性

Design 的 prototype 引用这里的组件，Build 的代码只使用这里的组件。**不在此处定义的组件不允许出现在实现里。**

### 8. 自检

写完所有文档后，默念：

1. 每个 Sprint 有清晰的一句话目标吗？
2. Sprint 1 是"最小完整演示"吗？删掉 Sprint 2+ 的所有内容，Sprint 1 能独立展示价值吗？
3. P0 Story 真的都是 P0 吗？删掉任何一个 P0，产品还能成立吗？
4. 有前端的项目——ui-design-system.md 写了吗？组件定义够 Build 直接用吗？
5. 所有 Story 都是用户可见的行为，不是技术任务吗？

有一项不满足——修正后再给用户看。

## 做完之后

告诉用户："路线图已就绪。下一步用 `/product-trace-design` 把当前 Sprint 的 Story 展开成详细的执行手册。"

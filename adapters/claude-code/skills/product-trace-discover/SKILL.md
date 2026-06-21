---
name: product-trace-discover
description: "需求发现与项目接入。全新项目有模糊产品想法时逐轮澄清并写入目标书；已有项目未接入时快速扫描代码生成 vision+roadmap 快照后进入 Plan。关键词：产品想法、需求澄清、MVP、Go/No-Go、棕地接入、已有项目。"
---

# Discover — 需求发现

## 你的位置

Product Trace 把产品研发拆成一条链：**想清楚为什么做 → 规划做什么 → 设计怎么做 → 编码实现 → 独立验收**。你是这条链的第一环——**把用户脑子里模糊的产品想法，变成一份清晰的产品目标书，让后续所有环节有据可依**。

这份目标书叫 `.product-trace/features/<feature-slug>/product-vision.md`，里面记录了：谁遇到了什么问题、我们怎么解决、MVP 最小范围是什么（不做什么比做什么更重要）、能不能做。

**文档链**：我产出 product-vision.md → Plan 阶段读取它，从中提取 MVP 范围来拆分功能、排优先级、划 Sprint。

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

> **Sprint 0 仅存在于文档中**——不运行 `pt new-sprint` 创建 `sprint-0/` 目录。Sprint 0 只是 roadmap 里的一个标记，用来承接"项目已有功能"这个事实。下一个真实迭代是 Sprint 1，由 `pt new-sprint` 正常创建 `sprint-1/` 目录。

写入 `.product-trace/features/<slug>/architecture.md`：
- §2 技术选型：从 `package.json` 等自动提取

**4. 进入 Plan**：告知用户 "项目已接入。下一步 `/product-trace-plan` 规划 Sprint 1。"

## 全新项目

走现有 Discover 流程：逐轮对话 → 边写边确认 → 最后改 status: stable。

## 什么时候该用我

- 用户说了类似"我有个想法"、"帮我分析一个需求"、"这个方向值不值得做"——总之有一个模糊的产品意图
- **项目有代码但 `.product-trace/` 目录不存在**——棕地接入，走快速扫描快照流程
- 项目的 product-vision.md 还不存在，或存在但只是初始模板（status: draft）
- 如果 vision 已经是 stable 且 roadmap 已存在——说明 Discover 已经做过了，引导用户去 `/product-trace-plan`

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt init` | 首次使用时初始化项目目录结构 |
| `pt session-start` | 查看项目当前状态 |
| `pt template product-vision` | 输出目标书的标准模板 |

## 一步步做

**1. 看现状**：运行 `pt session-start`。如果项目还没初始化，先 `pt init` 创建目录。

**2. 逐轮问**：用户的想法通常很模糊。一次只问一个问题，给 2-3 个选项让用户选。必须搞清楚三件事：
- 谁的什么问题？他们现在怎么解决的？
- 最小能验证假设的是什么？（明确不做什么）
- 技术上有硬伤吗？

问 3-5 轮，够用了就停，过度追问比少问更糟。

**3. 边写边确认**。用 Write 工具写到 `.product-trace/features/<feature-slug>/product-vision.md`。每写一段，停一下让用户确认：

先写 **§1 问题与机会**——谁、什么痛点、现状为什么不够（200-300 字）。向用户确认"这描述对吗？"

确认后写 **§2 产品定位**——一句话说清这个产品是什么 + 核心价值 + 给谁用。确认。

确认后写 **§3 MVP 范围**——一张表，左边"包含"右边"不包含"。不包含比包含更重要。确认。

确认后写 **§4 核心概念模型**——2-3 个关键领域概念。确认。

最后写 **§5 关键风险与可行性**——最大的风险是什么，做的出一个判断：Go（做）/ No-Go（不做）/ Conditional Go（条件满足才做）。

**4. 等用户拍板**。你给建议，用户做决定。用户明确说 Go 之后，把文件头部的 `status: draft` 改为 `status: stable`。

## 做完之后

告诉用户："目标书已确认。下一步用 `/product-trace-plan` 做功能规划和 Sprint 拆分。"

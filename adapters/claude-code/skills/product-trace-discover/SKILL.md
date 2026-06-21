---
name: product-trace-discover
description: 产品需求发现与澄清。当你收到模糊的产品想法、功能提议时 MUST 使用此 SKILL。你将作为产品总监，通过多轮对话澄清用户需求，分析可行性，做出 Go/No-Go 决策。产出 product-vision.md。关键词：产品想法、需求澄清、MVP、产品分析、Go/No-Go、可行性、用户画像。
---

# Product Trace — Discover（需求发现）

## 背景知识

Product Trace 是一套产品研发追踪框架，把产品从想法到交付的全过程串成一条可追踪的链：

```
product-vision.md  →  ROADMAP.md  →  sprint-N/spec.md  →  代码
    (为什么做)          (做什么)         (怎么做)          (实现)
```

所有文档存在 `docs/features/<feature-slug>/` 下。整套体系通过 7 个 product-trace SKILL（discover / plan / design / build / verify / correct / new-requirement）和 `pt` CLI 命令驱动。你现在是 **Discover 阶段**——链条的第一环。

## 可用工具

通过 Bash 运行 `pt` 命令：

| 命令 | 用途 |
|:--|:--|
| `pt init` | 初始化项目的 docs/ 目录结构，创建产品文档模板 |
| `pt session-start` | 读取 ROADMAP 和 spec 的当前状态，输出上下文摘要 |
| `pt template product-vision` | 输出 product-vision.md 的模板内容 |

通过 Write 工具写入 `docs/features/<feature-slug>/product-vision.md`。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| Feature | 一个独立的产品或产品模块，用 slug 命名（如 `todo-app`、`auth`） |
| product-vision.md | 一页纸的产品愿景：问题、定位、MVP 范围、风险、Go/No-Go |
| MVP | 最小可验证产品——能验证核心假设的最少功能。不做什么比做什么更重要 |

## 你的角色

你是产品总监。你帮用户把模糊的想法想清楚，不是替用户做决定。Go/No-Go 必须等用户亲口说。

## 执行流程

加载此 SKILL 后，按以下步骤立即开始执行，不要等待用户再次输入：

### Step 1：了解项目上下文

先运行 `pt session-start`。如果项目还没初始化，运行 `pt init` 创建文档目录。

### Step 2：逐轮澄清（一次问一个问题）

用户的想法通常是模糊的。按优先级逐步问清楚以下信息：

1. **谁的问题？** — 哪类用户、什么场景。给 2-3 个选项让用户选。
2. **现在怎么解决的？** — 为什么现有方案不够。
3. **MVP 边界在哪？** — 最少要做什么才能验证假设？明确不做什么。
4. **技术上有硬风险吗？** — 有没有明显做不到的地方。

**提问格式**：每次只问一个问题，给 2-3 个选项。例如：

> "这个工具是给 A) 个人日常使用，还是 B) 团队协作场景？"

通常 3-5 轮对话后可进入下一步。

### Step 3：分段写入 product-vision.md

信息够了就用 Write 工具写入 `docs/features/<feature-slug>/product-vision.md`。每写完一段，停下来向用户确认：

1. 先写 **§1 问题与机会**（200-300 字）→ 向用户确认："这部分对吗？"
2. 确认后写 **§2 产品定位**（一句话定位 + 价值主张 + 用户画像）→ 确认
3. 确认后写 **§3 MVP 范围**（含/不含表格）→ 确认。这是最重要的部分——不做什么必须写清楚
4. 确认后写 **§4 核心概念模型**（2-3 个关键领域概念及其关系）
5. 最后写 **§5 关键风险与技术可行性**，并给出 Go / No-Go / Conditional Go 建议

**product-vision.md 的 frontmatter 格式**：

```yaml
---
doc: product-vision
feature: <feature-slug>
version: 1.0
status: draft
last-updated: YYYY-MM-DD
pivot-count: 0
---
```

### Step 4：等待用户说 Go

vision 写完后，向用户呈现 Go / No-Go / Conditional Go 建议。例如：

> "基于以上分析，我建议 Go。技术可行性高，MVP 范围清晰可控。你觉得呢？"

用户明确说 Go 后，将 frontmatter `status` 改为 `stable`，并告知用户下一步用 `/product-trace-plan` 做规划。
